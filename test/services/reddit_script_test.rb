# frozen_string_literal: true

require "test_helper"

class RedditScriptTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @previous_credentials = Config.reddit
    Config.reddit = {
      username: "script_sender",
      client_id: "client",
      client_secret: "secret",
      password: "password"
    }.to_deep_struct
    @subscription = subscriptions(:subscription)
    @channel =
      DeliveryChannel.create!(key: "reddit", enabled: true, amount_cents: 0)
    @destination =
      DeliveryDestination.create!(
        user: @subscription.user,
        delivery_channel: @channel,
        recipient: "u/recipient"
      )
    @delivery =
      Delivery.create!(
        subscription: @subscription,
        delivery_destination: @destination,
        event_key: "reddit",
        subject: "hello",
        body_text: "message"
      )
    @token_request =
      stub_request(
        :post,
        "https://www.reddit.com/api/v1/access_token"
      ).to_return(
        body: { access_token: "script-token", token_type: "bearer" }.to_json
      )
    stub_request(:get, "https://oauth.reddit.com/api/v1/me").to_return(
      body: { name: "script_sender" }.to_json
    )
    @sent =
      stub_request(:post, "https://oauth.reddit.com/api/compose").with(
        body: {
          api_type: "json",
          to: "recipient",
          subject: "hello",
          text: "message"
        }
      ).to_return(body: { json: { errors: [] } }.to_json)
  end

  teardown do
    Config.reddit = @previous_credentials
    Current.reset
  end

  test "delivery requires confirmation and recipient changes invalidate queued delivery" do
    assert_equal :canceled, DeliveryAdapters.deliver(@delivery).status
    assert_not_requested @token_request
    assert @destination.confirm_verification(@destination.verification_token)
    assert_equal "accepted", DeliveryAdapters.deliver(@delivery).status
    assert_requested @sent
    @destination.update!(recipient: "another")
    assert_not @destination.recipient_verified?
    assert_equal :canceled, DeliveryAdapters.deliver(@delivery).status
    assert_requested @sent, times: 1
  end

  test "public posts and other senders are rejected" do
    @destination.confirm_verification(@destination.verification_token)
    @delivery.visibility = "public"
    assert_equal "reddit_public_unavailable",
                 assert_raises(DeliveryAdapters::Rejected) {
                   DeliveryAdapters.deliver(@delivery)
                 }.code
    assert_not_requested @token_request
    @delivery.visibility = "private"
    stub_request(:get, "https://oauth.reddit.com/api/v1/me").to_return(
      body: { name: "someone_else" }.to_json
    )
    assert_equal "reddit_invalid_sender",
                 assert_raises(DeliveryAdapters::Rejected) {
                   DeliveryAdapters.deliver(@delivery)
                 }.code
    assert_not_requested @sent
  end

  test "provider errors are not treated as accepted" do
    @destination.confirm_verification(@destination.verification_token)
    stub_request(:post, "https://oauth.reddit.com/api/compose").to_return(
      body: { json: { errors: [["RATELIMIT", "wait", ""]] } }.to_json
    )
    error =
      assert_raises(DeliveryAdapters::Rejected) do
        DeliveryAdapters.deliver(@delivery)
      end
    assert_equal "reddit_ratelimit", error.code
    assert error.retryable
  end

  test "uncertain writes are not retried as provider rejections" do
    @destination.confirm_verification(@destination.verification_token)
    stub_request(:post, "https://oauth.reddit.com/api/compose").to_timeout
    assert_raises(Timeout::Error) { DeliveryAdapters.deliver(@delivery) }
    stub_request(:post, "https://oauth.reddit.com/api/compose").to_return(
      status: 503
    )
    assert_raises(IOError) { DeliveryAdapters.deliver(@delivery) }
    stub_request(:post, "https://oauth.reddit.com/api/compose").to_return(
      body: "{}"
    )
    assert_raises(IOError) { DeliveryAdapters.deliver(@delivery) }
  end

  test "reddit is private only with no user connection or oauth flow" do
    assert_equal "private", @channel.visibility_restriction
    assert_not @channel.show_connection?
    assert_not @channel.show_visibility?
    assert_not_includes DeliveryConnectionOauth::PROVIDERS, "reddit"
    assert_nil @destination.connection
    @destination.recipient = "r/community"
    assert_not @destination.valid?
  end
end
