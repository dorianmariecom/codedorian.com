# frozen_string_literal: true

require "test_helper"

class NewDeliveryAdaptersTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @subscription = subscriptions(:subscription)
    @channel = DeliveryChannel.create!(key: "email", enabled: true, amount_cents: 0)
    @destination = DeliveryDestination.create!(user: @subscription.user, name: "Email", delivery_channel: @channel, recipient: "recipient@example.com")
    SharedEmailVerification.confirm(@destination, @destination.verification_token)
    @delivery = Delivery.create!(subscription: @subscription, delivery_destination: @destination, event_key: "new-providers", subject: "Bonjour", body_text: "Le monde", body_html: "<p>Le monde</p>")
    @old_meta = ENV.fetch("META_DELIVERY_API_VERSION", nil)
    ENV["META_DELIVERY_API_VERSION"] = "v25.0"
  end

  teardown do
    ENV["META_DELIVERY_API_VERSION"] = @old_meta
    Current.reset
  end

  test "Google providers send encoded multipart MIME" do
    %w[gmail google_workspace].each_with_index do |provider, index|
      configure(provider)
      sent = stub_request(:post, "https://gmail.googleapis.com/gmail/v1/users/me/messages/send").with do |request|
        assert_equal "Bearer access", request.headers["Authorization"]
        mail = Mail.read_from_string(Base64.urlsafe_decode64(JSON.parse(request.body).fetch("raw")))
        assert_equal ["recipient@example.com"], mail.to
        assert_equal "Bonjour", mail.subject
        assert_equal "Le monde", mail.text_part.decoded
        assert_equal "<p>Le monde</p>", mail.html_part.decoded
        true
      end.to_return(body: { id: "gmail-id" }.to_json)
      assert_equal "gmail-id", DeliveryAdapters.deliver(@delivery).provider_id
      assert_requested sent, times: index + 1
      remove_request_stub(sent)
    end
  end

  test "Outlook accepts MIME with an empty 202 response" do
    configure("outlook")
    sent = stub_request(:post, "https://graph.microsoft.com/v1.0/me/sendMail").with do |request|
      assert_equal "Bearer access", request.headers["Authorization"]
      assert_equal "text/plain", request.headers["Content-Type"]
      assert_equal "Bonjour", Mail.read_from_string(Base64.strict_decode64(request.body)).subject
      true
    end.to_return(status: 202, body: "")
    result = DeliveryAdapters.deliver(@delivery)
    assert_equal "accepted", result.status
    assert_nil result.provider_id
    assert_requested sent
  end

  test "SendGrid reads acceptance id from response headers" do
    configure("sendgrid")
    sent = stub_request(:post, "https://api.sendgrid.com/v3/mail/send").with do |request|
      body = JSON.parse(request.body)
      assert_equal "Bearer api-secret", request.headers["Authorization"]
      assert_equal [{ "to" => [{ "email" => "recipient@example.com" }] }], body["personalizations"]
      assert_equal [{ "type" => "text/plain", "value" => "Le monde" }, { "type" => "text/html", "value" => "<p>Le monde</p>" }], body["content"]
      true
    end.to_return(status: 202, body: "", headers: { "X-Message-Id" => "sendgrid-id" })
    assert_equal "sendgrid-id", DeliveryAdapters.deliver(@delivery).provider_id
    assert_requested sent
  end

  test "Resend preserves content and uses stable idempotency" do
    configure("resend")
    sent = stub_request(:post, "https://api.resend.com/emails").with(
      headers: { "Authorization" => "Bearer api-secret", "Idempotency-Key" => Digest::SHA256.hexdigest("delivery-#{@delivery.id}") },
      body: { from: "sender@example.com", to: ["recipient@example.com"], subject: "Bonjour", text: "Le monde", html: "<p>Le monde</p>" }.to_json
    ).to_return(body: { id: "resend-id" }.to_json)
    assert_equal "resend-id", DeliveryAdapters.deliver(@delivery).provider_id
    assert_requested sent
  end

  test "Mailgun uses the selected regional endpoint and form fields" do
    configure("mailgun")
    %w[us eu].each do |region|
      @delivery.connection.update!(mailgun_region: region)
      host = region == "eu" ? "api.eu.mailgun.net" : "api.mailgun.net"
      sent = stub_request(:post, "https://#{host}/v3/mail.example.com/messages").with(
        basic_auth: %w[api api-secret],
        body: { from: "sender@example.com", to: "recipient@example.com", subject: "Bonjour", text: "Le monde", html: "<p>Le monde</p>" }
      ).to_return(body: { id: "mailgun-id" }.to_json)
      assert_equal "mailgun-id", DeliveryAdapters.deliver(@delivery).provider_id
      assert_requested sent
    end
  end

  test "Mailchimp sends transactional mail and rejects unsuccessful recipient results" do
    configure("mailchimp")
    sent = stub_request(:post, "https://mandrillapp.com/api/1.0/messages/send.json").with do |request|
      body = JSON.parse(request.body)
      assert_equal "api-secret", body["key"]
      assert_equal "sender@example.com", body["message"]["from_email"]
      assert_equal "<p>Le monde</p>", body["message"]["html"]
      true
    end.to_return(body: [{ status: "queued", _id: "mandrill-id" }].to_json)
    assert_equal "mandrill-id", DeliveryAdapters.deliver(@delivery).provider_id
    assert_requested sent
    stub_request(:post, "https://mandrillapp.com/api/1.0/messages/send.json").to_return(body: [{ status: "rejected", _id: "id" }].to_json)
    error = assert_raises(DeliveryAdapters::Rejected) { DeliveryAdapters.deliver(@delivery) }
    assert_equal "mailchimp_rejected", error.code
  end

  test "SES signs the API request and sends MIME without retries" do
    configure("aws_ses")
    sent = stub_request(:post, "https://email.eu-west-1.amazonaws.com/v2/email/outbound-emails").with do |request|
      assert_match(/AWS4-HMAC-SHA256/, request.headers["Authorization"])
      body = JSON.parse(request.body)
      assert_equal ["recipient@example.com"], body["Destination"]["ToAddresses"]
      assert_equal "Bonjour", Mail.read_from_string(Base64.strict_decode64(body["Content"]["Raw"]["Data"])).subject
      true
    end.to_return(body: { MessageId: "ses-id" }.to_json)
    assert_equal "ses-id", DeliveryAdapters.deliver(@delivery).provider_id
    assert_requested sent
    stub_request(:post, "https://email.eu-west-1.amazonaws.com/v2/email/outbound-emails").to_return(status: 500, body: "{}")
    assert_raises(IOError) { DeliveryAdapters.deliver(@delivery) }
    assert_requested :post, "https://email.eu-west-1.amazonaws.com/v2/email/outbound-emails", times: 2
  end

  test "SES signs temporary credentials and rejects missing message identifiers" do
    configure("aws_ses")
    @delivery.connection.update!(aws_session_token: "session-token")
    sent = stub_request(:post, "https://email.eu-west-1.amazonaws.com/v2/email/outbound-emails").with do |request|
      assert_equal "session-token", request.headers["X-Amz-Security-Token"]
      assert_match(/SignedHeaders=content-type;host;x-amz-date;x-amz-security-token,/, request.headers["Authorization"])
      true
    end.to_return(body: { MessageId: "" }.to_json)
    assert_raises(IOError) { DeliveryAdapters.deliver(@delivery) }
    assert_requested sent
  end

  test "Meta messaging sends scoped recipient ids and plain text" do
    %w[messenger instagram].each do |provider|
      configure(provider, channel: provider)
      host = provider == "messenger" ? "graph.facebook.com" : "graph.instagram.com"
      sent = stub_request(:post, "https://#{host}/v25.0/sender-id/messages").with do |request|
        body = JSON.parse(request.body)
        assert_equal "Bearer access", request.headers["Authorization"]
        assert_equal({ "id" => "12345" }, body["recipient"])
        assert_equal({ "text" => "Bonjour\n\nLe monde" }, body["message"])
        true
      end.to_return(body: { message_id: "meta-id" }.to_json)
      assert_equal "meta-id", DeliveryAdapters.deliver(@delivery).provider_id
      assert_requested sent
    end
  end

  test "Telegram sends numeric chat ids and handles application throttling" do
    configure("telegram", channel: "telegram")
    @delivery.connection.update!(access_token: "123:bot-token")
    sent = stub_request(:post, "https://api.telegram.org/bot123:bot-token/sendMessage").with do |request|
      assert_equal "12345", JSON.parse(request.body)["chat_id"]
      true
    end.to_return(body: { ok: true, result: { message_id: 123 } }.to_json)
    assert_equal "123", DeliveryAdapters.deliver(@delivery).provider_id
    assert_requested sent
    stub_request(:post, "https://api.telegram.org/bot123:bot-token/sendMessage").to_return(body: { ok: false, error_code: 429 }.to_json)
    error = assert_raises(DeliveryAdapters::Rejected) { DeliveryAdapters.deliver(@delivery) }
    assert error.retryable
  end

  test "Viber validates status even on HTTP success" do
    configure("viber", channel: "viber")
    sent = stub_request(:post, "https://chatapi.viber.com/pa/send_message").with do |request|
      assert_equal "access", request.headers["X-Viber-Auth-Token"]
      body = JSON.parse(request.body)
      assert_equal "12345", body["receiver"]
      assert_equal({ "name" => "sender-id" }, body["sender"])
      true
    end.to_return(body: { status: 0, message_token: 987 }.to_json)
    assert_equal "987", DeliveryAdapters.deliver(@delivery).provider_id
    assert_requested sent
    stub_request(:post, "https://chatapi.viber.com/pa/send_message").to_return(body: { status: 6, status_message: "not subscribed" }.to_json)
    error = assert_raises(DeliveryAdapters::Rejected) { DeliveryAdapters.deliver(@delivery) }
    assert_equal "viber_6", error.code
  end

  test "all new providers reject auth and rate limits and preserve unknown outcomes" do
    endpoints = {
      "gmail" => "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      "google_workspace" => "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      "outlook" => "https://graph.microsoft.com/v1.0/me/sendMail",
      "aws_ses" => "https://email.eu-west-1.amazonaws.com/v2/email/outbound-emails",
      "sendgrid" => "https://api.sendgrid.com/v3/mail/send",
      "resend" => "https://api.resend.com/emails",
      "mailgun" => "https://api.mailgun.net/v3/mail.example.com/messages",
      "mailchimp" => "https://mandrillapp.com/api/1.0/messages/send.json",
      "messenger" => "https://graph.facebook.com/v25.0/sender-id/messages",
      "instagram" => "https://graph.instagram.com/v25.0/sender-id/messages",
      "telegram" => "https://api.telegram.org/bot123:bot-token/sendMessage",
      "viber" => "https://chatapi.viber.com/pa/send_message"
    }
    statuses = [401, 403, 429]
    endpoints.each do |provider, endpoint|
      configure(provider, channel: provider.in?(%w[messenger instagram telegram viber]) ? provider : "email")
      @delivery.connection.update!(access_token: "123:bot-token") if provider == "telegram"
      statuses.each do |status|
        stub_request(:post, endpoint).to_return(status: status, body: "{}")
        error = assert_raises(DeliveryAdapters::Rejected, provider) { DeliveryAdapters.deliver(@delivery) }
        assert_equal status == 429, error.retryable
      end
      stub_request(:post, endpoint).to_timeout
      assert_raises(Timeout::Error, provider) { DeliveryAdapters.deliver(@delivery) }
      unless provider.in?(%w[outlook sendgrid])
        stub_request(:post, endpoint).to_return(body: "broken json")
        assert_raises(JSON::ParserError, provider) { DeliveryAdapters.deliver(@delivery) }
      end
    end
  end

  test "empty provider identifiers are uncertain rather than accepted" do
    configure("resend")
    stub_request(:post, "https://api.resend.com/emails").to_return(body: { id: nil }.to_json)
    assert_raises(IOError) { DeliveryAdapters.deliver(@delivery) }
  end

  test "Meta reports provider rejection codes and Viber rate limits retry" do
    configure("messenger", channel: "messenger")
    stub_request(:post, "https://graph.facebook.com/v25.0/sender-id/messages").to_return(status: 400, body: { error: { code: 10, message: "Outside conversation window" } }.to_json)
    error = assert_raises(DeliveryAdapters::Rejected) { DeliveryAdapters.deliver(@delivery) }
    assert_equal "messenger_10", error.code
    assert_not error.retryable
    configure("viber", channel: "viber")
    stub_request(:post, "https://chatapi.viber.com/pa/send_message").to_return(body: { status: 12 }.to_json)
    error = assert_raises(DeliveryAdapters::Rejected) { DeliveryAdapters.deliver(@delivery) }
    assert error.retryable
  end

  test "unverified email never reaches any provider" do
    %w[gmail google_workspace outlook aws_ses sendgrid resend mailgun mailchimp].each do |provider|
      configure(provider)
      @destination.update!(recipient: "changed@example.com")
      assert_equal :canceled, DeliveryAdapters.deliver(@delivery).status
    end
    assert_not_requested :post, /gmail|microsoft|amazonaws|sendgrid|resend|mailgun|mandrill/
  end

  private

  def configure(provider, channel: "email")
    connection = DeliveryConnection.create!(
      user: users(:admin), name: provider, provider: provider, smtp_from: "sender@example.com",
      access_token: "access", refresh_token: "refresh", token_expires_at: 1.hour.from_now,
      api_key: "api-secret", sender: "sender-id", aws_access_key_id: "test-key",
      aws_secret_access_key: "test-secret", aws_region: "eu-west-1", mailgun_domain: "mail.example.com", mailgun_region: "us"
    )
    @delivery.assign_attributes(connection: connection, channel: channel, recipient: channel == "email" ? "recipient@example.com" : "12345")
  end
end
