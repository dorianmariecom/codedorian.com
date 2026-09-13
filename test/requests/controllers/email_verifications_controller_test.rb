# frozen_string_literal: true

require "test_helper"

class EmailVerificationsControllerTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper

  setup do
    Current.with(user: users(:admin)) do
      @address =
        users(:other_user).email_addresses.create!(
          email_address: "confirm@example.com"
        )
    end
  end

  test "GET does not verify and public POST confirms without signing in" do
    parameters = {
      kind: "account",
      id: @address.id,
      token: @address.verification_token
    }
    get email_verification_path, params: parameters
    assert_response :success
    assert_select "form[action=?]", email_verification_path
    assert_not @address.reload.verified?
    assert_includes response.headers["Cache-Control"], "no-store"
    post email_verification_path, params: parameters, as: :json
    assert_response :success
    assert @address.reload.verified?
    assert_nil session[:user_id]
    post email_verification_path, params: parameters, as: :json
    assert_response :unprocessable_content
    assert_nil response.parsed_body["data"]
  end

  test "owners can view and request confirmation in simple interface with localized mail" do
    @locale = I18n.locale
    users(:other_user).update_column(:interface, "simple")
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    get email_address_path(@address, locale: @locale)
    assert_response :success
    assert_select "form[action=?]",
                  email_address_verification_path(@address, locale: @locale),
                  count: 1
    assert_enqueued_emails 1 do
      post email_address_verification_path(@address, locale: @locale), as: :json
      assert_response :success
    end
    mail =
      EmailVerificationMailer
        .with(locale: @locale)
        .confirmation(
          email_address: @address.email_address,
          url: "https://example.com/confirm"
        )
        .message
    assert_equal I18n.t(
                   "email_verification_mailer.confirmation.subject",
                   locale: @locale
                 ),
                 mail.subject
    assert_includes mail.html_part.body.decoded,
                    I18n.t(
                      "email_verification_mailer.confirmation.instructions",
                      locale: @locale
                    )
    assert_includes mail.text_part.body.decoded, "https://example.com/confirm"
  end

  test "verified addresses do not send and other users cannot request" do
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    assert_no_enqueued_emails do
      post email_address_verification_path(email_addresses(:other_email)),
           as: :json
      assert_response :success
      post email_address_verification_path(email_addresses(:admin_email)),
           as: :json
      assert_response :bad_request
    end
  end

  test "anonymous requests require authentication and invalid tokens expose no data" do
    assert_no_enqueued_emails do
      post email_address_verification_path(@address, locale: @locale), as: :json
      assert_response :unauthorized
    end
    get email_verification_path,
        params: {
          kind: "account",
          id: @address.id,
          token: "bad"
        },
        as: :json
    assert_response :unprocessable_content
    assert_nil response.parsed_body["data"]
    assert_not @address.reload.verified?
  end
  test "subscription confirmation requires a selected destination scoped to the owner" do
    Current.with(user: users(:admin)) do
      channel = DeliveryChannel.create!(key: "email", amount_cents: 0)
      @destination =
        DeliveryDestination.create!(
          user: users(:admin),
          delivery_channel: channel,
          recipient: "confirm@example.com"
        )
      @selection =
        SubscriptionDestination.create!(
          subscription: subscriptions(:subscription),
          delivery_destination: @destination
        )
    end
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    assert_no_enqueued_emails do
      post subscription_destination_verification_path(
             subscriptions(:subscription),
             @selection
           ),
           as: :json
      assert_response :bad_request
    end
    delete login_path
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    assert_enqueued_emails 1 do
      post subscription_destination_verification_path(
             subscriptions(:subscription),
             @selection
           ),
           as: :json
      assert_response :success
    end
    get subscription_path(subscriptions(:subscription))
    assert_response :success
    assert_select "form[action=?]",
                  subscription_destination_verification_path(
                    subscriptions(:subscription),
                    @selection
                  )
    @selection.update!(selected: false)
    assert_no_enqueued_emails do
      post subscription_destination_verification_path(
             subscriptions(:subscription),
             @selection
           ),
           as: :json
      assert_response :bad_request
    end
  end

  test "destination public confirmation rejects stale tokens and verifies matching account email" do
    Current.with(user: users(:admin)) do
      channel = DeliveryChannel.create!(key: "email", amount_cents: 0)
      @destination =
        DeliveryDestination.create!(
          user: users(:other_user),
          delivery_channel: channel,
          recipient: @address.email_address
        )
    end
    parameters = {
      kind: "destination",
      id: @destination.id,
      token: @destination.verification_token
    }
    get email_verification_path, params: parameters, as: :json
    assert_response :success
    assert_not @destination.reload.recipient_verified?
    post email_verification_path, params: parameters
    assert_response :success
    assert @destination.reload.recipient_verified?
    assert @address.reload.verified?
    assert_nil session[:user_id]
  end

  test "public confirmation enforces CSRF when protection is enabled" do
    previous = ActionController::Base.allow_forgery_protection
    ActionController::Base.allow_forgery_protection = true
    post email_verification_path,
         params: {
           kind: "account",
           id: @address.id,
           token: @address.verification_token
         }
    assert_response :unprocessable_content
    assert_not @address.reload.verified?
    post email_verification_path,
         params: {
           kind: "account",
           id: @address.id,
           token: @address.verification_token
         },
         headers: {
           "Token" => tokens(:token).token
         }
    assert_response :unprocessable_content
    assert_not @address.reload.verified?
  ensure
    ActionController::Base.allow_forgery_protection = previous
  end

  test "requests share a five per minute limit per requester" do
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    assert_enqueued_emails 5 do
      5.times do
        post email_address_verification_path(@address), as: :json
        assert_response :success
      end
      post subscription_destination_verification_path(
             subscriptions(:subscription),
             0
           ),
           as: :json
      assert_response :too_many_requests
    end
    travel 61.seconds do
      assert_enqueued_emails 1 do
        post email_address_verification_path(@address), as: :json
        assert_response :success
      end
    end
    delete login_path
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    assert_enqueued_emails 1 do
      post email_address_verification_path(@address), as: :json
      assert_response :success
    end
  end
end
