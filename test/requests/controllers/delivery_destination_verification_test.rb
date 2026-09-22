# frozen_string_literal: true

require "test_helper"

class DeliveryDestinationVerificationTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper

  setup do
    Current.with(user: users(:admin)) do
      @subscription = subscriptions(:subscription)
      channel = DeliveryChannel.create!(key: "email", amount_cents: 0)
      @destination =
        DeliveryDestination.create!(
          user: @subscription.user,
          delivery_channel: channel,
          recipient: "confirm@example.com"
        )
      @selection =
        SubscriptionDestination.create!(
          subscription: @subscription,
          delivery_destination: @destination
        )
      @address =
        @subscription.user.email_addresses.create!(
          email_address: @destination.recipient
        )
    end
  end

  test "signed in owners return to their subscription after confirmation" do
    @subscription.update_column(:user_id, users(:other_user).id)
    @destination.update_column(:user_id, users(:other_user).id)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    token = @destination.reload.verification_token
    get verification_delivery_destination_path(id: @destination),
        params: { token: token, subscription_id: @subscription.id }
    assert_response :success
    assert_select "input[name=subscription_id][value=?]", @subscription.id.to_s
    post confirm_verification_delivery_destination_path(id: @destination),
         params: { token: token, subscription_id: @subscription.id }
    assert_redirected_to subscription_path(@subscription)
    assert @destination.reload.recipient_verified?
    follow_redirect!
    assert_response :success
  end

  test "existing confirmation links return signed in owners to their subscription" do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    post confirm_verification_delivery_destination_path(id: @destination),
         params: { token: @destination.verification_token }
    assert_redirected_to subscription_path(@subscription)
  end

  test "confirmation does not redirect another user to a private subscription" do
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    post confirm_verification_delivery_destination_path(id: @destination),
         params: { token: @destination.verification_token, subscription_id: @subscription.id }
    assert_response :success
    assert_nil response.headers["Location"]
    assert @destination.reload.recipient_verified?
  end

  test "requests use destination ids and require a selected destination scoped to the subscription owner" do
    assert_no_enqueued_emails do
      post request_verification_subscription_delivery_destination_path(
             subscription_id: @subscription.id,
             id: @destination.id
           ),
           as: :json
      assert_response :unauthorized
    end
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    assert_no_enqueued_emails do
      post request_verification_subscription_delivery_destination_path(
             subscription_id: @subscription.id,
             id: @destination.id
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
      post request_verification_subscription_delivery_destination_path(
             subscription_id: @subscription.id,
             id: @destination.id
           ),
           as: :json
      assert_response :success
    end
    get subscription_path(@subscription)
    assert_response :success
    assert_select "form[action=?]",
                  request_verification_subscription_delivery_destination_path(
                    subscription_id: @subscription.id,
                    id: @destination.id
                  )
    @selection.update!(selected: false)
    assert_no_enqueued_emails do
      post request_verification_subscription_delivery_destination_path(
             subscription_id: @subscription.id,
             id: @destination.id
           ),
           as: :json
      assert_response :bad_request
    end
  end

  test "ordinary owners can request recipient confirmation and non email channels cannot" do
    @subscription.update_column(:user_id, users(:other_user).id)
    @destination.update_column(:user_id, users(:other_user).id)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    assert_enqueued_emails 1 do
      post request_verification_subscription_delivery_destination_path(
             subscription_id: @subscription.id,
             id: @destination.id
           )
      assert_redirected_to subscription_path(@subscription)
    end
    @destination.delivery_channel.update_column(:key, "messages")
    assert_no_enqueued_emails do
      post request_verification_subscription_delivery_destination_path(
             subscription_id: @subscription.id,
             id: @destination.id
           ),
           as: :json
      assert_response :bad_request
    end
  end

  test "public GET is read only and POST verifies account email without signing in" do
    locale = I18n.locale
    token = @destination.verification_token
    get verification_delivery_destination_path(
          id: @destination,
          locale: locale
        ),
        params: {
          token: token
        }
    assert_response :success
    assert_select "form[action=?]",
                  confirm_verification_delivery_destination_path(
                    id: @destination,
                    locale: locale
                  )
    assert_includes response.headers["Cache-Control"], "no-store"
    assert_not @destination.reload.recipient_verified?
    post confirm_verification_delivery_destination_path(
           id: @destination,
           locale: locale
         ),
         params: {
           token: token
         }
    assert_response :success
    assert @destination.reload.recipient_verified?
    assert @address.reload.verified?
    assert_nil session[:user_id]
    post confirm_verification_delivery_destination_path(
           id: @destination,
           locale: locale
         ),
         params: {
           token: token
         },
         as: :json
    assert_response :unprocessable_content
    assert_nil response.parsed_body["data"]
  end

  test "public policy rejects invalid and changed record tokens without exposing private destinations" do
    get delivery_destination_path(id: @destination), as: :json
    assert_response :bad_request
    get verification_delivery_destination_path(id: @destination),
        params: {
          token: @address.verification_token
        },
        as: :json
    assert_response :unprocessable_content
    token = @destination.verification_token
    Current.with(user: users(:admin)) do
      @destination.update!(recipient: "changed@example.com")
    end
    post confirm_verification_delivery_destination_path(id: @destination),
         params: {
           token: token
         },
         as: :json
    assert_response :unprocessable_content
    assert_nil response.parsed_body["data"]
    assert_not @destination.reload.recipient_verified?
  end

  test "requests use default rate limiting and verified recipients do not send" do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    assert_enqueued_emails DeliveryDestinationsController::VERIFICATION_REQUEST_LIMIT do
      DeliveryDestinationsController::VERIFICATION_REQUEST_LIMIT.times do
        post request_verification_subscription_delivery_destination_path(
               subscription_id: @subscription.id,
               id: @destination.id
             ),
             as: :json
        assert_response :success
      end
      post request_verification_subscription_delivery_destination_path(
             subscription_id: @subscription.id,
             id: @destination.id
           ),
           as: :json
      assert_response :too_many_requests
    end
    SharedEmailVerification.confirm(
      @destination,
      @destination.verification_token
    )
    travel DeliveryDestinationsController::VERIFICATION_REQUEST_WINDOW +
             1.second do
      assert_no_enqueued_emails do
        post request_verification_subscription_delivery_destination_path(
               subscription_id: @subscription.id,
               id: @destination.id
             ),
             as: :json
        assert_response :success
      end
    end
  end
end
