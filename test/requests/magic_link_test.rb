# frozen_string_literal: true

require "test_helper"

class MagicLinkTest < ActionDispatch::IntegrationTest
  include ActionMailer::TestHelper

  test "email login sends a localized link and authenticates only on POST" do
    address = email_addresses(:other_email)
    get(new_magic_link_login_path)
    assert_response(:success)
    assert_select("form[action=?]", request_magic_link_login_path)

    redirect_path = new_login_path
    assert_emails(1) do
      perform_enqueued_jobs(only: ActionMailer::MailDeliveryJob) do
        post(
          request_magic_link_login_path,
          params: {
            session: {
              email_address: " #{address.email_address.upcase} "
            },
            redirect_to: redirect_path
          }
        )
      end
    end
    assert_redirected_to(new_magic_link_login_path)
    mail = ActionMailer::Base.deliveries.last
    assert_equal([address.email_address], mail.to)
    assert_equal(I18n.t("session_mailer.magic_link.subject"), mail.subject)
    url =
      mail
        .text_part
        .body
        .decoded
        .lines
        .map(&:strip)
        .find { |line| line.start_with?(Current.base_url) }
    assert(url)

    get(url)
    assert_response(:success)
    assert_nil(session[:user_id])
    assert_equal("no-store", response.headers["Cache-Control"])
    assert_select(
      "form[action=?][method=post]",
      authenticate_magic_link_login_path
    )
    assert_select("input[type=submit][value=?]", I18n.t("session.new.submit"))
    params = Rack::Utils.parse_nested_query(URI.parse(url).query)
    post(authenticate_magic_link_login_path, params: params)
    assert_redirected_to(redirect_path)
    assert_equal(address.user_id, session[:user_id])
  end

  test "shared email addresses receive one magic link per user" do
    address = email_addresses(:other_email)
    other_address = email_addresses(:admin_email)
    other_address.update_columns(email_address: address.email_address)
    duplicate_address = address.dup
    duplicate_address.save!(validate: false)
    get(new_magic_link_login_path)
    redirect_path = new_login_path
    link_path = magic_link_login_path

    assert_emails(2) do
      perform_enqueued_jobs(only: ActionMailer::MailDeliveryJob) do
        post(
          request_magic_link_login_path,
          params: {
            session: { email_address: address.email_address },
            redirect_to: redirect_path
          }
        )
      end
    end
    assert_redirected_to(new_magic_link_login_path)
    assert_equal(I18n.t("session.request_magic_link.notice"), flash[:notice])
    assert_nil(session[:user_id])

    user_ids = ActionMailer::Base.deliveries.last(2).map do |mail|
      assert_equal([address.email_address], mail.to)
      assert_equal(I18n.t("session_mailer.magic_link.subject"), mail.subject)
      url = mail.text_part.body.decoded.lines.map(&:strip).find do |line|
        line.start_with?(Current.base_url)
      end
      assert(url)
      params = Rack::Utils.parse_nested_query(URI.parse(url).query)
      assert_equal(redirect_path, params["redirect_to"])
      assert_equal(link_path, URI.parse(url).path)
      linked_address = EmailAddress.find_by_magic_link(
        params["email_address_id"],
        params["token"]
      )
      assert(linked_address)
      linked_address.user_id
    end
    assert_equal([address.user_id, other_address.user_id].sort, user_ids.sort)
  end

  test "unknown and missing email addresses have the same response" do
    ["missing@example.test", nil].each do |email|
      assert_no_enqueued_emails do
        post(
          request_magic_link_login_path,
          params: {
            session: {
              email_address: email
            }
          }
        )
      end
      assert_redirected_to(new_magic_link_login_path)
      assert_equal(I18n.t("session.request_magic_link.notice"), flash[:notice])
      assert_nil(session[:user_id])
    end
  end

  test "invalid expired wrong-purpose and deleted email links cannot log in" do
    address = email_addresses(:other_email)
    valid_token = address.magic_link_token
    tokens = [
      "invalid",
      "#{valid_token}x",
      address.signed_id(expires_in: 15.minutes),
      nil
    ]
    tokens.each { |token| assert_rejected_link(address.id, token) }
    travel(16.minutes) { assert_rejected_link(address.id, valid_token) }
    address.destroy!
    assert_rejected_link(address.id, valid_token)
  end

  test "changing the email address or owner invalidates a link" do
    address = email_addresses(:other_email)
    token = address.magic_link_token
    address.update_columns(email_address: "changed@example.test")
    assert_rejected_link(address.id, token)
    token = address.reload.magic_link_token
    address.update_columns(user_id: users(:admin).id)
    assert_rejected_link(address.id, token)
  end

  test "expiry is checked again when the confirmation is submitted" do
    address = email_addresses(:other_email)
    params = { email_address_id: address.id, token: address.magic_link_token }
    get(magic_link_login_path, params: params)
    assert_response(:success)
    travel(16.minutes) do
      post(authenticate_magic_link_login_path, params: params)
      assert_redirected_to(new_magic_link_login_path)
      assert_nil(session[:user_id])
    end
  end

  test "external redirect is ignored" do
    address = email_addresses(:other_email)
    post(
      authenticate_magic_link_login_path,
      params: {
        email_address_id: address.id,
        token: address.magic_link_token,
        redirect_to: "//example.com"
      }
    )
    assert_redirected_to(address.user)
    assert_equal(address.user_id, session[:user_id])
  end

  private

  def assert_rejected_link(id, token)
    params = { email_address_id: id, token: token }
    get(magic_link_login_path, params: params)
    assert_redirected_to(new_magic_link_login_path)
    assert_nil(session[:user_id])
    post(authenticate_magic_link_login_path, params: params)
    assert_redirected_to(new_magic_link_login_path)
    assert_nil(session[:user_id])
  end
end
