# frozen_string_literal: true

require "test_helper"

class RedditDestinationVerificationTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper

  setup do
    @previous_credentials = Config.reddit
    Config.reddit = {
      username: "script_sender",
      client_id: "client",
      client_secret: "secret",
      password: "password"
    }.to_deep_struct
    Current.with(user: users(:admin)) do
      @subscription = subscriptions(:subscription)
      @channel =
        DeliveryChannel.create!(key: "reddit", enabled: true, amount_cents: 0)
      @destination =
        DeliveryDestination.create!(
          user: @subscription.user,
          delivery_channel: @channel,
          recipient: "u/Recipient"
        )
      @selection =
        SubscriptionDestination.create!(
          subscription: @subscription,
          delivery_destination: @destination
        )
    end
  end

  teardown { Config.reddit = @previous_credentials }

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

  test "confirmation redirects another user to the homepage" do
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    post confirm_verification_delivery_destination_path(id: @destination),
         params: { token: @destination.verification_token, subscription_id: @subscription.id }
    assert_redirected_to root_path
    assert @destination.reload.recipient_verified?
  end

  test "owners request private confirmation and public confirmation requires POST" do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    assert_enqueued_with(job: RedditVerificationJob) do
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
    delete login_path
    token = @destination.verification_token
    get verification_delivery_destination_path(id: @destination),
        params: {
          token: token
        }
    assert_response :success
    assert_not @destination.reload.recipient_verified?
    post confirm_verification_delivery_destination_path(id: @destination),
         params: {
           token: token
         },
         as: :json
    assert_response :success
    assert @destination.reload.recipient_verified?
    assert @destination.available?
    assert_nil session[:user_id]
    post confirm_verification_delivery_destination_path(id: @destination),
         params: {
           token: token
         },
         as: :json
    assert_response :unprocessable_content
  end

  test "changed and expired tokens cannot confirm a destination" do
    token = @destination.verification_token
    travel 25.hours do
      post confirm_verification_delivery_destination_path(id: @destination),
           params: {
             token: token
           },
           as: :json
      assert_response :unprocessable_content
    end
    Current.with(user: users(:admin)) do
      @destination.update!(recipient: "another")
    end
    post confirm_verification_delivery_destination_path(id: @destination),
         params: {
           token: token
         },
         as: :json
    assert_response :unprocessable_content
    assert_not @destination.reload.recipient_verified?
  end

  test "verification messages use script credentials and stale jobs do not send" do
    token_request =
      stub_request(:post, "https://www.reddit.com/api/v1/access_token").with(
        basic_auth: %w[client secret],
        body: {
          grant_type: "password",
          username: "script_sender",
          password: "password"
        }
      ).to_return(
        body: { access_token: "script-token", token_type: "bearer" }.to_json
      )
    stub_request(:get, "https://oauth.reddit.com/api/v1/me").with(
      headers: {
        "Authorization" => "Bearer script-token"
      }
    ).to_return(body: { name: "script_sender" }.to_json)
    sent =
      stub_request(:post, "https://oauth.reddit.com/api/compose")
        .with do |request|
          body = URI.decode_www_form(request.body).to_h
          assert_equal "recipient", body["to"]
          assert_includes body["text"], "https://example.com/confirm"
          assert_includes body["text"], "u/script_sender"
          assert_equal "Bearer script-token", request.headers["Authorization"]
          assert_equal "web:codedorian.com:1.0 (by /u/script_sender)", request.headers["User-Agent"]
          true
        end
        .to_return(body: { json: { errors: [] } }.to_json)
    token = @destination.verification_token
    RedditVerificationJob.perform_now(
      destination: @destination,
      token: token,
      url: "https://example.com/confirm",
      locale: I18n.locale.to_s
    )
    assert_requested token_request
    assert_requested sent
    Current.with(user: users(:admin)) do
      @destination.update!(recipient: "another")
    end
    RedditVerificationJob.perform_now(
      destination: @destination,
      token: token,
      url: "https://example.com/confirm",
      locale: I18n.locale.to_s
    )
    assert_requested sent, times: 1
  end

  test "unselected destinations and other owners cannot request confirmation" do
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    assert_no_enqueued_jobs(only: RedditVerificationJob) do
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
    @selection.update!(selected: false)
    assert_no_enqueued_jobs(only: RedditVerificationJob) do
      post request_verification_subscription_delivery_destination_path(
             subscription_id: @subscription.id,
             id: @destination.id
           ),
           as: :json
      assert_response :bad_request
    end
  end
end
