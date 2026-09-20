# frozen_string_literal: true

require "test_helper"

class FacebookDeliveryTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @connection =
      DeliveryConnection.create!(
        provider: "facebook",
        name: "Page",
        access_token: "page-token",
        sender: "123456"
      )
    @channel =
      DeliveryChannel.create!(
        key: "facebook",
        only: "public",
        public_pattern: "(?:)",
        show_recipient: false,
        enabled: true,
        amount_cents: 0,
        delivery_connection: @connection,
        show_visibility: true
      )
    @subscription = subscriptions(:subscription)
    @destination =
      DeliveryDestination.create!(
        user: @subscription.user,
        delivery_channel: @channel,
        visibility: "public"
      )
    @delivery =
      Delivery.create!(
        subscription: @subscription,
        delivery_destination: @destination,
        event_key: "facebook",
        subject: "Bonjour",
        body_text: "Le monde",
        url: "https://example.com/article"
      )
  end

  teardown do
    Current.reset
  end

  test "publishes text and link to the configured page" do
    sent =
      stub_request(:post, "https://graph.facebook.com/v26.0/123456/feed").with(
        headers: {
          "Authorization" => "Bearer page-token"
        },
        body: {
          message: "Bonjour\n\nLe monde",
          link: "https://example.com/article"
        }.to_json
      ).to_return(body: { id: "123456_789" }.to_json)
    result = DeliveryAdapters.deliver(@delivery)
    assert_equal :accepted, result.status
    assert_equal "123456_789", result.provider_id
    assert_requested sent
  end

  test "text only posts omit the link" do
    @delivery.url = nil
    sent =
      stub_request(:post, "https://graph.facebook.com/v26.0/123456/feed").with(
        body: { message: "Bonjour\n\nLe monde" }.to_json
      ).to_return(body: { id: "123456_789" }.to_json)
    DeliveryAdapters.deliver(@delivery)
    assert_requested sent
  end

  test "private or recipient addressed posts are rejected before sending" do
    @destination.visibility = "private"
    assert @destination.valid?
    assert_equal "public", @destination.visibility
    @delivery.visibility = "private"
    assert_equal "facebook_public_only",
                 assert_raises(DeliveryAdapters::Rejected) {
                   DeliveryAdapters.deliver(@delivery)
                 }.code
    @destination.visibility = "public"
    @destination.recipient = "987654"
    assert_not @destination.valid?
    @delivery.visibility = "public"
    @delivery.recipient = "987654"
    assert_equal "invalid_recipient",
                 assert_raises(DeliveryAdapters::Rejected) {
                   DeliveryAdapters.deliver(@delivery)
                 }.code
    assert_not_requested :post, /graph.facebook.com/
  end

  test "requires an admin page token and numeric page id" do
    assert @channel.available?
    @connection.sender = "page-name"
    assert_not @connection.ready?
    @connection.sender = "123456"
    @connection.access_token = nil
    assert_not @connection.ready?
    @connection.access_token = "token"
    @connection.user = users(:other_user)
    assert_not @connection.valid?
    assert_not @connection.ready?
    @destination.delivery_connection = @connection
    assert_not @destination.valid?
  end

  test "provider errors retain codes without exposing messages" do
    stub_request(
      :post,
      "https://graph.facebook.com/v26.0/123456/feed"
    ).to_return(
      status: 400,
      body: { error: { code: 190, message: "secret provider detail" } }.to_json
    )
    error =
      assert_raises(DeliveryAdapters::Rejected) do
        DeliveryAdapters.deliver(@delivery)
      end
    assert_equal "facebook_190", error.code
    assert_not error.retryable
  end

  test "rate limits are retryable but missing ids and server errors are uncertain" do
    request =
      stub_request(:post, "https://graph.facebook.com/v26.0/123456/feed")
    request.to_return(status: 429, body: { error: { code: 4 } }.to_json)
    assert assert_raises(DeliveryAdapters::Rejected) {
             DeliveryAdapters.deliver(@delivery)
           }.retryable
    request.to_return(body: { id: "" }.to_json)
    assert_raises(IOError) { DeliveryAdapters.deliver(@delivery) }
    request.to_return(body: {}.to_json)
    assert_raises(IOError) { DeliveryAdapters.deliver(@delivery) }
    request.to_return(status: 503)
    assert_raises(IOError) { DeliveryAdapters.deliver(@delivery) }
  end
end
