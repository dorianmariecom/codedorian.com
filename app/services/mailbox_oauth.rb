# frozen_string_literal: true

class MailboxOauth
  PROVIDERS = %w[google gmail google_workspace outlook].freeze
  GOOGLE_SCOPES = %w[openid email https://www.googleapis.com/auth/gmail.send].freeze
  GOOGLE_CALENDAR_SCOPES = %w[https://www.googleapis.com/auth/calendar.calendarlist.readonly https://www.googleapis.com/auth/calendar.events.readonly].freeze
  MICROSOFT_SCOPES = %w[offline_access https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read].freeze

  class Error < StandardError
    attr_reader :code, :retryable

    def initialize(code = "mailbox_connection_failed", retryable: false)
      @code = code
      @retryable = retryable
      super(code)
    end
  end

  def initialize(provider)
    raise Error, "unsupported_provider" unless provider.in?(PROVIDERS)

    @provider = provider
  end

  def microsoft? = @provider == "outlook"

  def client_id
    if microsoft?
      Config.microsoft_delivery.client_id
    else
      Config.google_delivery.client_id
    end
  end

  def client_secret
    if microsoft?
      Config.microsoft_delivery.client_secret
    else
      Config.google_delivery.client_secret
    end
  end

  def configured? = client_id.present? && client_secret.present?

  def authorization_url(state:, verifier:, redirect_uri:, scope: nil)
    raise Error, "mailbox_not_configured" unless configured?

    parameters = {
      client_id: client_id, response_type: "code", redirect_uri: redirect_uri, state: state,
      scope: scopes(scope: scope).join(" "),
      code_challenge: Base64.urlsafe_encode64(Digest::SHA256.digest(verifier), padding: false),
      code_challenge_method: "S256", prompt: "consent"
    }
    parameters[:access_type] = "offline" unless microsoft?
    endpoint = microsoft? ? "https://login.microsoftonline.com/common/oauth2/v2.0/authorize" : "https://accounts.google.com/o/oauth2/v2/auth"
    "#{endpoint}?#{URI.encode_www_form(parameters)}"
  end

  def scopes(scope: nil)
    return MICROSOFT_SCOPES if microsoft?

    scopes = @provider == "google" ? %w[openid email] : GOOGLE_SCOPES
    scopes + (scope.to_s.split & GOOGLE_CALENDAR_SCOPES)
  end

  def exchange(code:, verifier:, redirect_uri:, scope: nil)
    data = token_request(grant_type: "authorization_code", code: code, code_verifier: verifier, redirect_uri: redirect_uri)
    attributes = token_attributes(data)
    attributes[:scope] = (data["scope"].to_s.split & scopes(scope: scope)).join(" ")
    raise Error, "mailbox_reconnect_required" if attributes[:refresh_token].blank?

    profile = get_profile(attributes.fetch(:access_token))
    if microsoft?
      email = profile["mail"].presence || profile["userPrincipalName"]
      sender = profile["id"]
    else
      raise Error unless profile["email_verified"] == true

      email = profile["email"]
      sender = profile["sub"]
    end
    unless sender.present? && email.to_s.match?(EmailAddress::EMAIL_ADDRESS_REGEXP)
      raise Error
    end

    attributes.merge(sender: sender, smtp_from: email, name: "#{@provider.tr('_', ' ')} · #{email}", enabled: true)
  end

  def access_token_for(connection)
    access_token = connection.with_lock do
      raise Error, "connection_disabled" unless connection.enabled?
      unless connection.provider == @provider && (@provider == "google" || connection.user.admin?)
        raise Error, "invalid_connection"
      end

      if @provider == "google" && !connection.calendar_access?
        raise Error, "calendar_permission_missing"
      end

      if connection.token_expires_at.nil? || connection.token_expires_at <= 1.minute.from_now
        raise Error, "mailbox_reconnect_required" if connection.refresh_token.blank?

        data = token_request(grant_type: "refresh_token", refresh_token: connection.refresh_token)
        attributes = token_attributes(data)
        attributes[:scope] = (connection.scope.to_s.split & data["scope"].to_s.split).join(" ") if data.key?("scope")
        Current.with(user: connection.user) { connection.update!(attributes) }
      end
      connection.access_token
    end
    if @provider == "google" && !connection.calendar_access?
      raise Error, "calendar_permission_missing"
    end

    access_token
  end

  private

  def token_attributes(data)
    unless data["token_type"].to_s.casecmp?("bearer") && data["access_token"].present? &&
             data["expires_in"].is_a?(Integer) && data["expires_in"].positive?
      raise Error
    end

    if @provider != "google" && data["scope"].present?
      scopes = data["scope"].split
      allowed = microsoft? ? ["Mail.Send", "https://graph.microsoft.com/Mail.Send"] : ["https://www.googleapis.com/auth/gmail.send"]
      raise Error, "mailbox_send_permission_missing" unless scopes.intersect?(allowed)
    end

    attributes = { access_token: data["access_token"], token_expires_at: data["expires_in"].seconds.from_now }
    attributes[:refresh_token] = data["refresh_token"] if data["refresh_token"].present?
    attributes
  end

  def token_request(parameters)
    raise Error, "mailbox_not_configured" unless configured?

    endpoint = microsoft? ? "https://login.microsoftonline.com/common/oauth2/v2.0/token" : "https://oauth2.googleapis.com/token"
    uri = URI(endpoint)
    request = Net::HTTP::Post.new(uri)
    request.set_form_data(parameters.merge(client_id: client_id, client_secret: client_secret))
    request_json(request)
  end

  def get_profile(token)
    endpoint = microsoft? ? "https://graph.microsoft.com/v1.0/me?$select=id,mail,userPrincipalName" : "https://openidconnect.googleapis.com/v1/userinfo"
    uri = URI(endpoint)
    request_json(Net::HTTP::Get.new(uri, "Authorization" => "Bearer #{token}"))
  end

  def request_json(request)
    response = Http.request(request)
    unless response.is_a?(Net::HTTPSuccess)
      status = response.code.to_i
      raise Error.new(status.in?([400, 401, 403]) ? "mailbox_reconnect_required" : "mailbox_http_#{status}", retryable: status == 429 || status >= 500)
    end
    data = JSON.parse(response.body)
    raise Error unless data.is_a?(Hash)

    data
  rescue JSON::ParserError, IOError, SystemCallError, Timeout::Error, OpenSSL::SSL::SSLError
    raise Error.new("mailbox_connection_failed", retryable: true)
  end
end
