# frozen_string_literal: true

require "test_helper"

class EmailAddressVerificationTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper

  setup do
    Current.with(user: users(:admin)) do
      @address =
        users(:other_user).email_addresses.create!(
          email_address: "confirm@example.com"
        )
    end
  end

  test "public GET only displays confirmation and POST verifies without signing in" do
    locale = I18n.locale
    token = @address.verification_token
    get verification_email_address_path(id: @address, locale: locale),
        params: {
          token: token
        }
    assert_response :success
    assert_select "form[action=?]",
                  confirm_verification_email_address_path(
                    id: @address,
                    locale: locale
                  )
    assert_includes response.headers["Cache-Control"], "no-store"
    assert_not @address.reload.verified?
    assert_nil session[:user_id]
    post confirm_verification_email_address_path(id: @address, locale: locale),
         params: {
           token: token
         },
         as: :json
    assert_response :success
    assert_equal [
      I18n.t(
        "email_addresses.confirm_verification.confirmed",
        locale: locale
      )
    ],
                 response.parsed_body["messages"]
    assert @address.reload.verified?
    assert_nil session[:user_id]
    post confirm_verification_email_address_path(id: @address, locale: locale),
         params: {
           token: token
         },
         as: :json
    assert_response :unprocessable_content
    assert_nil response.parsed_body["data"]
  end

  test "owners can view and request confirmation in simple interface with localized mail" do
    locale = I18n.locale
    users(:other_user).update_column(:interface, "simple")
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    get email_address_path(@address, locale: locale)
    assert_response :success
    assert_select "form[action=?]",
                  request_verification_email_address_path(
                    id: @address,
                    locale: locale
                  )
    assert_enqueued_email_with EmailVerificationMailer,
                               :confirmation,
                               params: {
                                 locale: locale
                               },
                               args: ->(args) do
                                 args.first[:email_address] ==
                                   @address.email_address &&
                                   URI(args.first[:url]).path ==
                                     verification_email_address_path(
                                       id: @address.id,
                                       locale: locale
                                     )
                               end do
      post request_verification_email_address_path(
             id: @address,
             locale: locale
           ),
           as: :json
      assert_response :success
    end
    assert_enqueued_emails 1 do
      post request_verification_user_email_address_path(
             user_id: users(:other_user).id,
             id: @address.id,
             locale: locale
           )
      assert_redirected_to email_address_path(@address, locale: locale)
    end
    mail =
      EmailVerificationMailer
        .with(locale: locale)
        .confirmation(
          email_address: @address.email_address,
          url: "https://example.com/confirm"
        )
        .message
    assert_equal I18n.t(
                   "email_verification_mailer.confirmation.subject",
                   locale: locale
                 ),
                 mail.subject
    assert_includes mail.html_part.body.decoded,
                    I18n.t(
                      "email_verification_mailer.confirmation.instructions",
                      locale: locale
                    )
    assert_includes mail.text_part.body.decoded, "https://example.com/confirm"
  end

  test "verification requests require authentication and ownership and verified addresses send nothing" do
    assert_no_enqueued_emails do
      post request_verification_email_address_path(id: @address), as: :json
      assert_response :unauthorized
    end
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    assert_no_enqueued_emails do
      post request_verification_email_address_path(
             id: email_addresses(:other_email)
           ),
           as: :json
      assert_response :success
      post request_verification_email_address_path(
             id: email_addresses(:admin_email)
           ),
           as: :json
      assert_response :bad_request
    end
  end

  test "public policy does not grant access to private email records" do
    get email_address_path(id: @address), as: :json
    assert_response :bad_request
    get verification_email_address_path(id: @address),
        params: {
          token: "bad"
        },
        as: :json
    assert_response :unprocessable_content
    assert_nil response.parsed_body["data"]
    post confirm_verification_email_address_path(id: @address),
         params: {
           token: @address.magic_link_token
         },
         as: :json
    assert_response :unprocessable_content
    token = @address.verification_token
    travel 25.hours do
      get verification_email_address_path(id: @address),
          params: {
            token: token
          },
          as: :json
      assert_response :unprocessable_content
    end
    assert_not @address.reload.verified?
  end

  test "public confirmation uses normal CSRF protection and the existing API token exemption" do
    previous = ActionController::Base.allow_forgery_protection
    ActionController::Base.allow_forgery_protection = true
    post confirm_verification_email_address_path(id: @address),
         params: {
           token: @address.verification_token
         }
    assert_response :unprocessable_content
    assert_not @address.reload.verified?
    post confirm_verification_email_address_path(id: @address),
         params: {
           token: @address.verification_token
         },
         headers: {
           "Token" => tokens(:token).token
         },
         as: :json
    assert_response :success
    assert @address.reload.verified?
  ensure
    ActionController::Base.allow_forgery_protection = previous
  end

  test "requests use the default IP limit and reset after the configured window" do
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    assert_enqueued_emails EmailAddressesController::VERIFICATION_REQUEST_LIMIT do
      EmailAddressesController::VERIFICATION_REQUEST_LIMIT.times do
        post request_verification_email_address_path(id: @address), as: :json
        assert_response :success
      end
      post request_verification_email_address_path(id: @address), as: :json
      assert_response :too_many_requests
    end
    delete login_path
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    assert_no_enqueued_emails do
      post request_verification_email_address_path(id: @address), as: :json
      assert_response :too_many_requests
    end
    assert_enqueued_emails 1 do
      post request_verification_email_address_path(id: @address),
           headers: {
             "REMOTE_ADDR" => "192.0.2.10"
           },
           as: :json
      assert_response :success
    end
    travel EmailAddressesController::VERIFICATION_REQUEST_WINDOW + 1.second do
      assert_enqueued_emails 1 do
        post request_verification_email_address_path(id: @address), as: :json
        assert_response :success
      end
    end
  end
end
