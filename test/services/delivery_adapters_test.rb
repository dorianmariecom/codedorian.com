# frozen_string_literal: true

require "test_helper"

class DeliveryAdaptersTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @subscription = subscriptions(:subscription)
    channel =
      DeliveryChannel.create!(key: "messages", enabled: true, amount_cents: 0)
    destination =
      DeliveryDestination.create!(
        user: @subscription.user,
        delivery_channel: channel
      )
    @delivery =
      Delivery.create!(
        subscription: @subscription,
        delivery_destination: destination,
        event_key: "test",
        subject: "Hello",
        body_text: "World",
        locale: "fr"
      )
  end

  teardown { Current.reset }

  test "SMS RCS and WhatsApp use explicit Twilio channels and templates" do
    %w[sms rcs whatsapp].each do |key|
      configure(key, "twilio", { account_sid: "ACtest", auth_token: "test" })
      @delivery.delivery_destination.delivery_channel.update!(
        messaging_service_sid: "MG#{key}",
        content_sid_en: "HXen",
        content_sid_fr: "HXfr"
      )
      sent =
        stub_request(
          :post,
          "https://api.twilio.com/2010-04-01/Accounts/ACtest/Messages.json"
        )
          .with do |request|
            body = URI.decode_www_form(request.body).to_h
            assert_equal "MG#{key}", body["MessagingServiceSid"]
            assert_equal(
              (
                if key.in?(%w[whatsapp rcs])
                  "#{key}:+33611223344"
                else
                  "+33611223344"
                end
              ),
              body["To"]
            )
            if key == "whatsapp"
              assert_equal "HXfr", body["ContentSid"]
              assert_equal(
                { "1" => "Hello", "2" => "World" },
                JSON.parse(body["ContentVariables"])
              )
            else
              assert_equal "Hello\n\nWorld", body["Body"]
            end
            true
          end
          .to_return(status: 201, body: { sid: "SMtest" }.to_json)
      assert_equal "SMtest", DeliveryAdapters.deliver(@delivery).provider_id
      assert_requested sent
      WebMock.reset!
    end
  end

  test "X private and public deliveries use different endpoints" do
    configure("x", "x", { access_token: "test" }, recipient: "@dorian")
    stub_request(:get, "https://api.x.com/2/users/by/username/dorian").to_return(body: { data: { id: "123" } }.to_json)
    direct =
      stub_request(
        :post,
        "https://api.x.com/2/dm_conversations/with/123/messages"
      ).to_return(status: 201, body: { data: { dm_event_id: "dm123" } }.to_json)
    assert_equal "dm123", DeliveryAdapters.deliver(@delivery).provider_id
    assert_requested direct
    @delivery.visibility = "public"
    public_post =
      stub_request(:post, "https://api.x.com/2/tweets").to_return(
        status: 201,
        body: { data: { id: "post123" } }.to_json
      )
    assert_equal "post123", DeliveryAdapters.deliver(@delivery).provider_id
    assert_requested public_post
  end

  test "Slack application errors are recorded as rejections" do
    stub_request(:get, %r{https://slack.com/api/conversations.list}).to_return(
      body: { ok: true, channels: [{ id: "C123", name: "general" }] }.to_json
    )
    configure("slack", "slack", { access_token: "test" }, recipient: "#general")
    stub_request(:post, "https://slack.com/api/chat.postMessage").to_return(
      status: 200,
      body: { ok: false, error: "channel_not_found" }.to_json
    )
    error =
      assert_raises(DeliveryAdapters::Rejected) do
        DeliveryAdapters.deliver(@delivery)
      end
    assert_equal "channel_not_found", error.code
  end

  test "Reddit private delivery is unavailable until capability is explicitly enabled" do
    configure(
      "reddit",
      "reddit",
      { access_token: "test" },
      recipient: "recipient"
    )
    @delivery.delivery_destination.delivery_channel.update!(only: "public")
    error =
      assert_raises(DeliveryAdapters::Rejected) do
        DeliveryAdapters.deliver(@delivery)
      end
    assert_equal "reddit_private_unavailable", error.code
  end

  test "Reddit posting uses subreddit destination" do
    configure(
      "reddit",
      "reddit",
      { access_token: "test" },
      recipient: "r/testing"
    )
    @delivery.visibility = "public"
    sent =
      stub_request(:post, "https://oauth.reddit.com/api/submit").with(
        body: {
          api_type: "json",
          kind: "self",
          sr: "testing",
          title: "Hello",
          text: "World"
        }
      ).to_return(
        status: 200,
        body: { json: { errors: [], data: { name: "t3_test" } } }.to_json
      )
    assert_equal "t3_test", DeliveryAdapters.deliver(@delivery).provider_id
    assert_requested sent
  end

  test "legacy destinations and queued snapshots keep their provider targets" do
    [
      ["slack", "C123", "private", "https://slack.com/api/chat.postMessage", { ok: true, ts: "slack123" }, "channel", "C123"],
      ["x", "123", "private", "https://api.x.com/2/dm_conversations/with/123/messages", { data: { dm_event_id: "dm123" } }, "text", "Hello\n\nWorld"],
      ["x", "123", "public", "https://api.x.com/2/tweets", { data: { id: "post123" } }, "text", "Hello\n\nWorld"],
      ["reddit", "testing", "public", "https://oauth.reddit.com/api/submit", { json: { errors: [], data: { name: "t3_test" } } }, "sr", "testing"],
      ["reddit", "recipient", "private", "https://oauth.reddit.com/api/compose", { json: { errors: [] } }, "to", "recipient"]
    ].each do |provider, recipient, visibility, endpoint, response, field, target|
      configure(provider, provider, { access_token: "test" }, recipient: recipient)
      channel = DeliveryChannel.find_or_create_by!(key: provider)
      channel.update!(enabled: true, only: nil)
      destination = @delivery.delivery_destination
      destination.update_columns(delivery_channel_id: channel.id, delivery_connection_id: @delivery.connection_id, recipient: recipient, visibility: visibility)
      destination.reload.update!(enabled: true)
      @delivery.update!(visibility: visibility)
      @delivery.reload
      # Changing the destination must not retarget an already queued delivery.
      destination.update!(recipient: { "slack" => "#changed", "x" => "@changed", "reddit" => visibility == "public" ? "r/changed" : "u/changed" }.fetch(provider))
      sent = stub_request(:post, endpoint).with do |request|
        body = provider == "reddit" ? URI.decode_www_form(request.body).to_h : JSON.parse(request.body)
        assert_equal target, body.fetch(field)
        true
      end.to_return(body: response.to_json)
      assert DeliveryAdapters.deliver(@delivery).status.present?
      assert_requested sent
      assert_not_requested :get, %r{https://(?:slack.com/api/|api.x.com/2/users/)}
      WebMock.reset!
    end
  end

  test "SMTP uses text and HTML with stable message identifier" do
    configure(
      "email",
      "smtp",
      { smtp_from: "sender@example.com", smtp_address: "smtp.example.com" },
      recipient: "recipient@example.com"
    )
    destination = @delivery.delivery_destination.reload
    destination.update!(
      delivery_channel: DeliveryChannel.create!(key: "email"),
      recipient: @delivery.recipient
    )
    SharedEmailVerification.confirm(destination, destination.verification_token)
    @delivery.body_html = "<p>World</p>"
    # Mail's test transport keeps this test independent of SMTP servers.
    original = Mail::SMTP.instance_method(:deliver!)
    captured = []
    Mail::SMTP.define_method(:deliver!) { |mail| captured << mail }
    DeliveryAdapters.deliver(@delivery)
    assert_equal "World", captured.sole.text_part.body.decoded
    assert_equal "<p>World</p>", captured.sole.html_part.body.decoded
    assert_equal ["recipient@example.com"], captured.sole.to
  ensure
    Mail::SMTP.define_method(:deliver!, original) if original
  end

  test "custom provider host resolution rejects internal addresses" do
    assert_raises(DeliveryAdapters::Rejected) do
      DeliveryProviderAddress.resolve!("127.0.0.1")
    end
    assert_raises(DeliveryAdapters::Rejected) do
      DeliveryProviderAddress.resolve!("::1")
    end
    assert_raises(DeliveryAdapters::Rejected) do
      DeliveryProviderAddress.resolve!("169.254.169.254")
    end
  end

  test "Apple business delivery uses Infobip text messages" do
    configure(
      "apple",
      "infobip",
      {
        base_url: "https://provider.example",
        api_key: "test",
        sender: "business-id"
      },
      recipient: "conversation-id"
    )
    sent =
      stub_request(:post, "https://provider.example/messages-api/1/messages")
        .with do |request|
          message = JSON.parse(request.body).fetch("messages").sole
          assert_equal "APPLE_MB", message.fetch("channel")
          assert_equal [{ "to" => "conversation-id" }],
                       message.fetch("destinations")
          assert_equal "TEXT",
                       message.fetch("content").fetch("body").fetch("type")
          true
        end
        .to_return(
          status: 200,
          body: { messages: [{ messageId: "apple-message" }] }.to_json
        )
    with_public_provider do
      assert_equal "apple-message",
                   DeliveryAdapters.deliver(@delivery).provider_id
    end
    assert_requested sent
  end

  test "Mastodon private mentions have explicit visibility and idempotency" do
    configure(
      "mastodon",
      "mastodon",
      { base_url: "https://provider.example", access_token: "test" },
      recipient: "@recipient@example.social"
    )
    sent =
      stub_request(:post, "https://provider.example/api/v1/statuses")
        .with do |request|
          body = JSON.parse(request.body)
          assert_equal "direct", body.fetch("visibility")
          assert body.fetch("status").start_with?("@recipient@example.social ")
          assert request.headers["Idempotency-Key"].present?
          true
        end
        .to_return(status: 200, body: { id: "mastodon-message" }.to_json)
    with_public_provider do
      assert_equal "mastodon-message",
                   DeliveryAdapters.deliver(@delivery).provider_id
    end
    assert_requested sent
  end

  private

  def with_public_provider
    original = DeliveryProviderAddress.method(:resolve!)
    DeliveryProviderAddress.define_singleton_method(:resolve!) do |_host|
      "93.184.216.34"
    end
    yield
  ensure
    DeliveryProviderAddress.define_singleton_method(:resolve!, original)
  end

  def configure(channel, provider, credentials, recipient: "+33611223344")
    connection =
      DeliveryConnection.create!(
        user: @subscription.user,
        name: provider,
        provider: provider,
        **credentials
      )
    @delivery.assign_attributes(
      channel: channel,
      connection_id: connection.id,
      recipient: recipient
    )
  end
end
