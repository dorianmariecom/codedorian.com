# frozen_string_literal: true

class DeliveryAdapters
  PUSH_BODY_LIMIT = 2000
  WHATSAPP_BODY_LIMIT = 1000
  TWILIO_BODY_LIMIT = 1500
  PROVIDER_BODY_LIMIT = 4000
  X_PUBLIC_BODY_LIMIT = 280
  X_PRIVATE_BODY_LIMIT = 10_000
  MASTODON_BODY_LIMIT = 400
  REDDIT_TITLE_LIMIT = 300
  REDDIT_SUBJECT_LIMIT = 100
  TWILIO_API_VERSION = "2010-04-01"

  class Rejected < StandardError
    attr_reader :code, :retryable

    def initialize(code, retryable: false)
      @code = code.to_s
      @retryable = retryable
      super(@code)
    end
  end

  Result = Data.define(:status, :provider_id)

  def self.deliver(delivery)
    result = new(delivery).call
    Result.new(
      status: result.fetch(:status, :accepted),
      provider_id: result[:provider_id]
    )
  end

  def initialize(delivery)
    @delivery = delivery
    @connection = delivery.connection
  end

  def call
    if @connection && !@connection.enabled?
      raise Rejected, "connection_disabled"
    end

    if DeliveryChannel::PROVIDERS.key?(@delivery.channel.to_s.to_sym) &&
         !@connection&.ready?
      raise Rejected, "configuration_missing"
    end

    case @delivery.channel
    when "messages"
      inbox
    when "push"
      push
    when "email"
      email
    when "sms", "whatsapp", "rcs"
      twilio
    when "apple"
      apple
    when "slack"
      slack
    when "x"
      x
    when "mastodon"
      mastodon
    when "reddit"
      reddit
    else
      raise Rejected, "unsupported_channel"
    end
  rescue KeyError
    raise IOError, "Provider response is incomplete" if @submitted

    raise Rejected, "configuration_missing"
  end

  private

  def recipient = @delivery.recipient
  def public? = @delivery.visibility == "public"
  def subject = @delivery.subject
  def channel_settings = @delivery.delivery_destination.delivery_channel
  def token = @connection.access_token
  def authorization = { "Authorization" => "Bearer #{token}" }
  def idempotency_key = Digest::SHA256.hexdigest("delivery-#{@delivery.id}")

  def text(limit = nil)
    value = [subject, @delivery.body_text].compact_blank.join("\n\n")
    compact_text(value, limit)
  end

  def compact_text(value, limit)
    return value unless limit && value.length > limit

    url =
      @delivery.url.presence ||
        if public?
          "#{Current.base_url}/x/#{@delivery.public_token}"
        else
          "#{Current.base_url}/deliveries/#{@delivery.id}"
        end
    unless url.start_with?("https://") && url.length < limit / 2
      raise Rejected, "content_too_long_without_link"
    end

    "#{value.truncate(limit - url.length - 2)}\n\n#{url}"
  end

  def inbox
    message =
      Message.create!(
        from_user: @delivery.service.user,
        to_user: @delivery.user,
        subject: subject,
        body:
          @delivery.body_html.presence ||
            ERB::Util.html_escape(@delivery.body_text)
      )
    { status: "delivered", provider_id: message.id.to_s }
  end

  def push
    user = @delivery.user
    raise Rejected, "no_push_devices" unless user.devices.exists?
    if Code::Object::Notification.ios_apps.empty? &&
         Code::Object::Notification.android_apps.empty?
      raise Rejected, "push_not_configured"
    end

    Code::Object::Notification.code_create!(
      to: user.to_code,
      subject: subject,
      body: @delivery.body_text.truncate(PUSH_BODY_LIMIT),
      path: "/deliveries/#{@delivery.id}",
      sound: "default",
      thread_id: "subscription-#{@delivery.subscription_id}",
      data: {
      }
    )
    { status: "accepted" }
  end

  def email
    mail = Mail.new
    mail.from = @connection.smtp_from
    mail.to = recipient
    mail.subject = subject
    mail.message_id = "delivery-#{@delivery.id}@codedorian.com"
    mail.text_part =
      Mail::Part.new(
        body: @delivery.body_text,
        content_type: "text/plain; charset=UTF-8"
      )
    if @delivery.body_html.present?
      mail.html_part =
        Mail::Part.new(
          body: @delivery.body_html,
          content_type: "text/html; charset=UTF-8"
        )
    end
    mail.delivery_method(:smtp, @connection.smtp_settings.symbolize_keys)
    mail.deliver!
    { status: "accepted", provider_id: mail.message_id }
  end

  def twilio
    account = @connection.account_sid
    channel = @delivery.channel
    to = channel.in?(%w[whatsapp rcs]) ? "#{channel}:#{recipient}" : recipient
    data = {
      "To" => to,
      "MessagingServiceSid" => channel_settings.messaging_service_sid
    }
    if channel == "whatsapp"
      data["ContentSid"] = (
        if @delivery.locale == "fr"
          channel_settings.content_sid_fr
        else
          channel_settings.content_sid_en
        end
      )
      data["ContentVariables"] = {
        "1" => subject,
        "2" => compact_text(@delivery.body_text, 1000)
      }.to_json
    else
      data["Body"] = text(TWILIO_BODY_LIMIT)
    end
    if channel_settings.callback_base_url.present?
      data["StatusCallback"] = channel_settings.callback_base_url.to_s +
        "/delivery_callbacks/twilio/#{@delivery.id}"
    end
    response =
      request(
        "https://api.twilio.com/#{TWILIO_API_VERSION}/Accounts/#{ERB::Util.url_encode(account)}/Messages.json",
        data,
        form: true,
        basic: [account, @connection.auth_token]
      )
    { provider_id: response.fetch("sid") }
  end

  def apple
    response =
      request(
        "#{provider_origin}/messages-api/1/messages",
        {
          messages: [
            {
              channel: "APPLE_MB",
              sender: @connection.sender,
              destinations: [{ to: recipient }],
              content: {
                body: {
                  type: "TEXT",
                  text: text(PROVIDER_BODY_LIMIT)
                }
              }
            }
          ]
        },
        headers: {
          "Authorization" => "App #{@connection.api_key}"
        }
      )
    { provider_id: response.fetch("messages").first.fetch("messageId") }
  end

  def slack
    response =
      request(
        "https://slack.com/api/chat.postMessage",
        {
          channel: recipient,
          text: text(PROVIDER_BODY_LIMIT),
          unfurl_links: false,
          unfurl_media: false
        },
        headers: authorization
      )
    unless response["ok"]
      raise Rejected, response.fetch("error", "slack_rejected")
    end

    { provider_id: response.fetch("ts") }
  end

  def x
    endpoint =
      (
        if public?
          "https://api.x.com/2/tweets"
        else
          "https://api.x.com/2/dm_conversations/with/#{ERB::Util.url_encode(recipient)}/messages"
        end
      )
    response =
      request(
        endpoint,
        { text: text(public? ? X_PUBLIC_BODY_LIMIT : X_PRIVATE_BODY_LIMIT) },
        headers: authorization
      )
    {
      provider_id: response.fetch("data").fetch(public? ? "id" : "dm_event_id")
    }
  end

  def mastodon
    content = text(MASTODON_BODY_LIMIT)
    content = "#{recipient.split.join(" ")} #{content}" unless public?
    response =
      request(
        "#{provider_origin}/api/v1/statuses",
        { status: content, visibility: public? ? "public" : "direct" },
        headers: authorization.merge("Idempotency-Key" => idempotency_key)
      )
    { provider_id: response.fetch("id") }
  end

  def reddit
    headers = authorization.merge("User-Agent" => "codedorian-delivery/1.0")
    if public?
      response =
        request(
          "https://oauth.reddit.com/api/submit",
          {
            api_type: "json",
            kind: "self",
            sr: recipient,
            title: subject.truncate(REDDIT_TITLE_LIMIT),
            text: @delivery.body_text
          },
          form: true,
          headers: headers
        )
      if response.dig("json", "errors").present?
        raise Rejected, "reddit_rejected"
      end

      { provider_id: response.fetch("json").fetch("data").fetch("name") }
    else
      unless channel_settings.private_delivery_enabled == true
        raise Rejected, "reddit_private_unavailable"
      end

      response =
        request(
          "https://oauth.reddit.com/api/compose",
          {
            api_type: "json",
            to: recipient,
            subject: subject.truncate(REDDIT_SUBJECT_LIMIT),
            text: @delivery.body_text
          },
          form: true,
          headers: headers
        )
      if response.dig("json", "errors").present?
        raise Rejected, "reddit_rejected"
      end

      { status: "accepted" }
    end
  end

  def provider_origin
    origin = URI.parse(@connection.base_url)
    unless origin.scheme == "https" && origin.host.present? &&
             origin.userinfo.nil? && origin.path.in?(["", "/"]) &&
             origin.query.nil? && origin.fragment.nil?
      raise Rejected, "invalid_provider_origin"
    end

    # Only admins may configure arbitrary provider origins; user connections use a validated public host.
    origin.to_s.delete_suffix("/")
  end

  def request(url, data, form: false, headers: {}, basic: nil)
    uri = URI.parse(url)
    req = Net::HTTP::Post.new(uri, headers)
    req.basic_auth(*basic) if basic
    if form
      req.set_form_data(data)
    else
      req["Content-Type"] = "application/json"
      req.body = data.to_json
    end
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 10
    http.read_timeout = 30
    http.write_timeout = 30
    if @connection&.provider.in?(%w[mastodon infobip])
      http.ipaddr = DeliveryProviderAddress.resolve!(uri.host)
    end
    @submitted = true
    response = http.start { |client| client.request(req) }
    status = response.code.to_i
    raise Rejected.new("http_429", retryable: true) if status == 429
    if status >= 400 && status < 500 && status != 408
      raise Rejected, "http_#{status}"
    end
    raise IOError, "Provider outcome unknown" unless status.between?(200, 299)

    JSON.parse(response.body)
  end
end
