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
    unless delivery.recipient_verified_for_delivery?
      delivery.recipient_unverified!
      return Result.new(status: :canceled, provider_id: nil)
    end
    result = new(delivery).call
    if delivery.connection&.provider.in?(%w[gmail google_workspace aws_ses resend mailgun mailchimp facebook messenger instagram telegram viber]) &&
         result[:status].to_s != "canceled" && result[:provider_id].blank?
      raise IOError, "Provider response is incomplete"
    end

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

    if @connection && DeliveryChannel::PROVIDERS.key?(@delivery.channel.to_s.to_sym) &&
         !DeliveryChannel.supports_provider?(@delivery.channel, @connection.provider)
      raise Rejected, "invalid_connection"
    end

    case @delivery.channel
    when "messages"
      inbox
    when "push"
      push
    when "email"
      email
    when "facebook"
      facebook
    when "messenger"
      messenger
    when "instagram"
      instagram
    when "telegram"
      telegram
    when "viber"
      viber
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
    when "webhook"
      webhook
    when "github"
      github
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
    return api_email unless @connection.provider == "smtp"

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
    unless @delivery.recipient_verified_for_delivery?
      @delivery.recipient_unverified!
      return { status: :canceled }
    end
    mail.deliver!
    { status: "accepted", provider_id: mail.message_id }
  end

  def facebook
    raise Rejected, "facebook_public_only" unless public?
    raise Rejected, "invalid_recipient" if recipient.present?

    response = request(
      "https://graph.facebook.com/#{meta_api_version}/#{@connection.sender}/feed",
      { message: text(PROVIDER_BODY_LIMIT), link: @delivery.url.presence }.compact,
      headers: authorization
    )
    { provider_id: response.fetch("id") }
  end

  def messenger
    response = request(
      "https://graph.facebook.com/#{meta_api_version}/#{ERB::Util.url_encode(@connection.sender)}/messages",
      { recipient: { id: recipient }, messaging_type: "RESPONSE", message: { text: text(2000) } },
      headers: authorization
    )
    { provider_id: response.fetch("message_id") }
  end

  def instagram
    response = request(
      "https://graph.instagram.com/#{meta_api_version}/#{ERB::Util.url_encode(@connection.sender)}/messages",
      { recipient: { id: recipient }, message: { text: text(1000) } },
      headers: authorization
    )
    { provider_id: response.fetch("message_id") }
  end

  def meta_api_version
    version = Config.meta_delivery.api_version
    raise Rejected, "configuration_missing" unless version.to_s.match?(/\Av[0-9]+\.0\z/)

    version
  end

  def telegram
    unless token.match?(/\A[0-9]+:[a-zA-Z0-9_-]+\z/)
      raise Rejected, "invalid_telegram_token"
    end

    response = request(
      "https://api.telegram.org/bot#{token}/sendMessage",
      { chat_id: recipient, text: text(4096), link_preview_options: { is_disabled: true } }
    )
    unless response["ok"] == true
      code = response.fetch("error_code", "rejected").to_s
      raise Rejected.new("telegram_#{code}", retryable: code == "429")
    end

    { provider_id: response.fetch("result").fetch("message_id").to_s }
  end

  def viber
    response = request(
      "https://chatapi.viber.com/pa/send_message",
      { receiver: recipient, type: "text", text: text(7000), sender: { name: @connection.sender } },
      headers: { "X-Viber-Auth-Token" => token }
    )
    status = response.fetch("status")
    raise Rejected.new("viber_#{status}", retryable: status == 12) unless status.zero?

    { provider_id: response.fetch("message_token").to_s }
  end

  def email_message
    mail = Mail.new
    mail.from = @connection.smtp_from
    mail.to = recipient
    mail.subject = subject
    mail.message_id = "delivery-#{@delivery.id}@codedorian.com"
    mail.text_part = Mail::Part.new(body: @delivery.body_text, content_type: "text/plain; charset=UTF-8")
    if @delivery.body_html.present?
      mail.html_part = Mail::Part.new(body: @delivery.body_html, content_type: "text/html; charset=UTF-8")
    end
    mail
  end

  def api_email
    if @connection.provider.in?(%w[gmail google_workspace outlook])
      MailboxOauth.new(@connection.provider).access_token_for(@connection)
    end
    unless @delivery.recipient_verified_for_delivery?
      @delivery.recipient_unverified!
      return { status: :canceled }
    end

    case @connection.provider
    when "gmail", "google_workspace"
      response = request(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        { raw: Base64.urlsafe_encode64(email_message.encoded, padding: false) }, headers: authorization
      )
      { provider_id: response.fetch("id") }
    when "outlook"
      # Graph accepts MIME and returns HTTP 202 without a message identifier.
      request("https://graph.microsoft.com/v1.0/me/sendMail", Base64.strict_encode64(email_message.encoded),
              headers: authorization, mime: true, parse_response: false)
      { status: "accepted" }
    when "aws_ses"
      aws_ses
    when "sendgrid"
      content = [{ type: "text/plain", value: @delivery.body_text }]
      content << { type: "text/html", value: @delivery.body_html } if @delivery.body_html.present?
      response = request("https://api.sendgrid.com/v3/mail/send", {
                           personalizations: [{ to: [{ email: recipient }] }],
        from: email_sender, subject: subject, content: content
                         }, headers: { "Authorization" => "Bearer #{@connection.api_key}" }, parse_response: false)
      { provider_id: response["X-Message-Id"] }
    when "resend"
      response = request("https://api.resend.com/emails", {
        from: @connection.smtp_from, to: [recipient], subject: subject,
        text: @delivery.body_text, html: @delivery.body_html.presence
      }.compact, headers: { "Authorization" => "Bearer #{@connection.api_key}", "Idempotency-Key" => idempotency_key })
      { provider_id: response.fetch("id") }
    when "mailgun"
      host = @connection.mailgun_region == "eu" ? "api.eu.mailgun.net" : "api.mailgun.net"
      response = request("https://#{host}/v3/#{ERB::Util.url_encode(@connection.mailgun_domain)}/messages", {
        "from" => @connection.smtp_from, "to" => recipient, "subject" => subject,
        "text" => @delivery.body_text, "html" => @delivery.body_html.presence
      }.compact, form: true, basic: ["api", @connection.api_key])
      { provider_id: response.fetch("id") }
    when "mailchimp"
      response = request("https://mandrillapp.com/api/1.0/messages/send.json", {
                           key: @connection.api_key,
        message: { from_email: email_sender[:email], from_name: email_sender[:name],
          to: [{ email: recipient, type: "to" }], subject: subject,
          text: @delivery.body_text, html: @delivery.body_html.presence }.compact
                         })
      if response.is_a?(Hash) && response["status"] == "error"
        raise Rejected, "mailchimp_rejected"
      end
      raise IOError, "Provider response is incomplete" unless response.is_a?(Array) && response.size == 1 && response.first.is_a?(Hash)

      result = response.fetch(0)
      unless result.fetch("status").in?(%w[sent queued scheduled])
        raise Rejected, "mailchimp_#{result.fetch('status')}"
      end

      { provider_id: result.fetch("_id") }
    else
      raise Rejected, "unsupported_provider"
    end
  rescue MailboxOauth::Error => e
    raise Rejected.new(e.code, retryable: e.retryable)
  end

  def email_sender
    address = Mail::Address.new(@connection.smtp_from)
    { email: address.address, name: address.display_name }.compact
  end

  def aws_ses
    region = @connection.aws_region
    domain = region.start_with?("cn-") ? "amazonaws.com.cn" : "amazonaws.com"
    host = "email.#{region}.#{domain}"
    path = "/v2/email/outbound-emails"
    data = {
      FromEmailAddress: @connection.smtp_from,
      Destination: { ToAddresses: [recipient] },
      Content: { Raw: { Data: Base64.strict_encode64(email_message.encoded) } }
    }
    timestamp = Time.now.utc.strftime("%Y%m%dT%H%M%SZ")
    date = timestamp[0, 8]
    scope = "#{date}/#{region}/ses/aws4_request"
    headers = {
      "content-type" => "application/json",
      "host" => host,
      "x-amz-date" => timestamp
    }
    if @connection.aws_session_token.present?
      headers["x-amz-security-token"] = @connection.aws_session_token
    end
    signed_headers = headers.keys.join(";")
    canonical_headers = headers.map { |key, value| "#{key}:#{value.strip}\n" }.join
    canonical_request = ["POST", path, "", canonical_headers, signed_headers, Digest::SHA256.hexdigest(data.to_json)].join("\n")
    string_to_sign = ["AWS4-HMAC-SHA256", timestamp, scope, Digest::SHA256.hexdigest(canonical_request)].join("\n")
    date_key = OpenSSL::HMAC.digest("SHA256", "AWS4#{@connection.aws_secret_access_key}", date)
    region_key = OpenSSL::HMAC.digest("SHA256", date_key, region)
    service_key = OpenSSL::HMAC.digest("SHA256", region_key, "ses")
    signing_key = OpenSSL::HMAC.digest("SHA256", service_key, "aws4_request")
    signature = OpenSSL::HMAC.hexdigest("SHA256", signing_key, string_to_sign)
    headers["Authorization"] = "AWS4-HMAC-SHA256 Credential=#{@connection.aws_access_key_id}/#{scope}, SignedHeaders=#{signed_headers}, Signature=#{signature}"

    response = request("https://#{host}#{path}", data, headers: headers)
    { provider_id: response.fetch("MessageId") }
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
    channel_id = SlackRecipient.resolve(@connection, recipient)
    response =
      request(
        "https://slack.com/api/chat.postMessage",
        {
          channel: channel_id,
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
    unless XRecipient.valid?(recipient, public: public?)
      raise Rejected, "invalid_x_recipient"
    end

    XOauth.access_token_for(@connection)
    content = text(public? ? X_PUBLIC_BODY_LIMIT : X_PRIVATE_BODY_LIMIT)
    if public?
      endpoint = "https://api.x.com/2/tweets"
      if recipient.present? && !recipient.match?(XRecipient::ID_FORMAT)
        content = "#{recipient} #{text(X_PUBLIC_BODY_LIMIT - recipient.length - 1)}"
      end
    else
      user_id = XRecipient.resolve(@connection, recipient)
      endpoint = "https://api.x.com/2/dm_conversations/with/#{user_id}/messages"
    end
    response = request(endpoint, { text: content }, headers: authorization)
    { provider_id: response.fetch("data").fetch(public? ? "id" : "dm_event_id") }
  rescue XOauth::Error => e
    raise Rejected.new(e.code, retryable: e.retryable)
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

  def github
    raise Rejected, "invalid_github_recipient" unless GithubRecipient.valid?(recipient)

    access_token = GithubOauth.access_token_for(@connection)
    repository = GithubApi.get("https://api.github.com/repos/#{recipient}", token: access_token)
    unless repository.is_a?(Hash) && repository["private"] == !public?
      raise Rejected, "github_repository_visibility_mismatch"
    end

    response = request(
      "https://api.github.com/repos/#{recipient}/issues",
      { title: subject, body: @delivery.body_text },
      headers: GithubApi.headers(access_token)
    )
    unless response.is_a?(Hash) && response["id"].is_a?(Integer) && response["id"].positive?
      raise IOError, "GitHub response is incomplete"
    end

    { provider_id: response.fetch("id").to_s }
  rescue GithubOauth::Error => e
    raise Rejected.new(e.code, retryable: e.retryable)
  end

  def reddit
    if !public? && channel_settings.only == "public"
      raise Rejected, "reddit_private_unavailable"
    end

    target = RedditRecipient.resolve(recipient, public: public?)
    RedditOauth.access_token_for(@connection)
    headers = authorization.merge("User-Agent" => RedditOauth.user_agent)
    if public?
      response =
        request(
          "https://oauth.reddit.com/api/submit",
          {
            api_type: "json",
            kind: "self",
            sr: target,
            title: subject.truncate(REDDIT_TITLE_LIMIT),
            text: @delivery.body_text
          },
          form: true,
          headers: headers
        )
      if response.dig("json", "errors").present?
        code = response["json"]["errors"].first.first.to_s
        raise Rejected.new("reddit_#{code.downcase}", retryable: code == "RATELIMIT")
      end

      { provider_id: response.fetch("json").fetch("data").fetch("name") }
    else
      if channel_settings.only == "public"
        raise Rejected, "reddit_private_unavailable"
      end

      response =
        request(
          "https://oauth.reddit.com/api/compose",
          {
            api_type: "json",
            to: target,
            subject: subject.truncate(REDDIT_SUBJECT_LIMIT),
            text: @delivery.body_text
          },
          form: true,
          headers: headers
        )
      if response.dig("json", "errors").present?
        code = response["json"]["errors"].first.first.to_s
        raise Rejected.new("reddit_#{code.downcase}", retryable: code == "RATELIMIT")
      end

      raise IOError, "Reddit response is incomplete" unless response["json"].is_a?(Hash)

      { status: "accepted" }
    end
  rescue RedditOauth::Error => e
    raise Rejected.new(e.code, retryable: e.retryable)
  end

  def webhook
    unless WebhookRecipient.valid?(recipient)
      raise Rejected, "invalid_webhook_url"
    end

    request(
      recipient,
      {
        id: @delivery.id,
        event_key: @delivery.event_key,
        subject: subject,
        body_text: @delivery.body_text,
        body_html: @delivery.body_html,
        url: @delivery.url,
        locale: @delivery.locale
      },
      headers: { "Idempotency-Key" => idempotency_key },
      parse_response: false
    )
    { status: "accepted" }
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

  def request(url, data, form: false, headers: {}, basic: nil, parse_response: true, mime: false)
    uri = URI.parse(url)
    req = Net::HTTP::Post.new(uri, headers)
    req.basic_auth(*basic) if basic
    if mime
      req["Content-Type"] = "text/plain"
      req.body = data
    elsif form
      req.set_form_data(data)
    else
      req["Content-Type"] = "application/json"
      req.body = data.to_json
    end
    ipaddr = nil
    if @delivery.channel == "webhook" || @connection&.provider.in?(%w[mastodon infobip])
      ipaddr = DeliveryProviderAddress.resolve!(uri.host)
    end
    @submitted = true
    response = Http.request(req, max_retries: 0, ipaddr: ipaddr)
    status = response.code.to_i
    if @connection&.provider.in?(%w[facebook messenger instagram]) && status >= 400 && status < 500 && status != 408
      begin
        error = JSON.parse(response.body)["error"]
        if error.is_a?(Hash) && error["code"].is_a?(Integer)
          code = error["code"]
          raise Rejected.new("#{@connection.provider}_#{code}", retryable: status == 429 || error["is_transient"] == true)
        end
      rescue JSON::ParserError, TypeError
        # An unstructured rejection still has a reliable HTTP status.
      end
    end
    raise Rejected.new("http_429", retryable: true) if status == 429
    if @connection&.provider == "github" && status == 403 && (response["X-RateLimit-Remaining"] == "0" || response["Retry-After"].present?)
      raise Rejected.new("http_403", retryable: true)
    end
    if status >= 400 && status < 500 && status != 408
      raise Rejected, "http_#{status}"
    end
    raise IOError, "Provider outcome unknown" unless status.between?(200, 299)

    return response unless parse_response

    result = JSON.parse(response.body)
    if @connection&.provider.in?(%w[facebook messenger instagram]) && result.is_a?(Hash) && result["error"].is_a?(Hash)
      code = result["error"]["code"].to_s.gsub(/[^0-9]/, "")
      raise Rejected.new("#{@connection.provider}_#{code}", retryable: result["error"]["is_transient"] == true)
    end
    result
  end
end
