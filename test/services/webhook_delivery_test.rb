# frozen_string_literal: true

require "test_helper"

class WebhookDeliveryTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @channel =
      DeliveryChannel.create!(
        key: "webhook",
        visibility_restriction: "private",
        enabled: true,
        amount_cents: 0,
        show_recipient: true
      )
    @destination =
      DeliveryDestination.create!(
        user: subscriptions(:subscription).user,
        delivery_channel: @channel,
        recipient: "https://hooks.example.com/events?source=code"
      )
    @delivery =
      Delivery.create!(
        subscription: subscriptions(:subscription),
        delivery_destination: @destination,
        event_key: "webhook-test",
        subject: "hello",
        body_text: "world",
        body_html: "<p>world</p>",
        locale: "fr"
      )
  end

  teardown { Current.reset }

  test "webhooks are available without a connection and require a private HTTPS destination" do
    assert @channel.available?
    assert @destination.available?
    assert_nil @destination.connection
    [
      "",
      "http://example.com",
      "https://user:password@example.com",
      "https://example.com/#fragment",
      "not a url"
    ].each do |recipient|
      @destination.recipient = recipient
      assert_not @destination.valid?, recipient
      assert @destination.errors[:recipient].present?
    end
    @destination.recipient = "https://example.com/hook"
    @destination.visibility = "public"
    assert @destination.valid?
    assert_equal "private", @destination.visibility
  end

  test "posts full JSON content with a stable idempotency key and accepts empty or text success responses" do
    sent =
      stub_request(:post, @delivery.recipient)
        .with(
          headers: {
            "Content-Type" => "application/json",
            "Idempotency-Key" =>
              Digest::SHA256.hexdigest("delivery-#{@delivery.id}")
          },
          body: {
            id: @delivery.id,
            event_key: "webhook-test",
            subject: "hello",
            body_text: "world",
            body_html: "<p>world</p>",
            url: nil,
            locale: "fr"
          }.to_json
        )
        .to_return(status: 204, body: "")
        .then
        .to_return(status: 200, body: "ok")
    with_public_provider do
      2.times do
        result = deliver_code(@delivery)
        assert_equal "accepted", result.status
        assert_nil result.provider_id
      end
    end
    assert_requested sent, times: 2
  end

  test "validates snapshotted URLs again before sending" do
    [
      "http://example.com/hook",
      "https://user:password@example.com/hook",
      "https://example.com/hook#fragment",
      "not a url"
    ].each do |recipient|
      @delivery.recipient = recipient
      error =
        assert_raises(DeliveryChannel::Rejected) { deliver_code(@delivery) }
      assert_equal "invalid_webhook_url", error.code
    end
    assert_not_requested :post, /example.com/
  end

  test "blocks internal addresses before sending" do
    @delivery.recipient = "https://127.0.0.1/hook"
    error = assert_raises(Code::Error) { deliver_code(@delivery) }
    assert_includes error.message, "local network requests are not allowed"
    assert_not_requested :post, /127.0.0.1/
  end

  test "uses existing rejection and uncertain outcome handling" do
    with_public_provider do
      [400, 429].each do |status|
        stub_request(:post, @delivery.recipient).to_return(status: status)
        error =
          assert_raises(DeliveryChannel::Rejected) { deliver_code(@delivery) }
        assert_equal "http_#{status}", error.code
        assert_equal status == 429, error.retryable
      end
      redirected =
        stub_request(:get, "https://other.example.com/").to_return(status: 200)
      [302, 408, 500].each do |status|
        stub_request(:post, @delivery.recipient).to_return(
          status: status,
          headers: {
            "Location" => "https://other.example.com"
          }
        )
        assert_equal "uncertain", deliver_code(@delivery).status
      end
      assert_requested redirected, times: 1
      assert_not_requested :post, "https://other.example.com"
      stub_request(:post, @delivery.recipient).to_timeout
      assert_raises(Code::Error) { deliver_code(@delivery) }
    end
  end

  private

  def with_public_provider
    original = Resolv.method(:getaddresses)
    Resolv.define_singleton_method(:getaddresses) { |_host| ["93.184.216.34"] }
    yield
  ensure
    Resolv.define_singleton_method(:getaddresses, original)
  end
end
