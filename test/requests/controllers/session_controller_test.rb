# frozen_string_literal: true

require "test_helper"

class SessionControllerTest < ActionDispatch::IntegrationTest
  include ControllerSmokeHelper

  setup do
    use_canonical_host

    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  smoke_actions_for "session"

  test "guest login form includes recaptcha fields" do
    delete(login_path)

    get(new_login_path)

    assert_response(:success)
    assert_match(/g-recaptcha-response/, response.body)
    assert_match(/g-recaptcha-action/, response.body)
  end

  test "logout deletes the locale cookie" do
    logged_out_session = open_session
    uri = URI.parse(Current.base_url)
    logged_out_session.https!(uri.scheme == "https")
    logged_out_session.host!(
      [uri.host, (uri.port unless uri.port == uri.default_port)].compact.join(
        ":"
      )
    )
    logged_out_session.post(locale_path(selected_locale: :fr))
    logged_out_session.post(
      login_path,
      params: {
        session: {
          email_address: email_addresses(:admin_email).email_address,
          password: passwords(:password).hint
        }
      }
    )

    logged_out_session.delete(login_path)

    assert_match(
      /locale=;.*max-age=0/,
      logged_out_session.response.headers["Set-Cookie"].join("\n")
    )
  end

  private

  def use_canonical_host
    uri = URI.parse(Current.base_url)

    https!(uri.scheme == "https")
    host!(
      [uri.host, (uri.port unless uri.port == uri.default_port)].compact.join(
        ":"
      )
    )
  end
end
