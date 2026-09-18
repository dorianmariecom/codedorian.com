# frozen_string_literal: true

class RedditOauth
  SCOPES = %w[identity submit].freeze

  class Error < StandardError
    attr_reader :code, :retryable

    def initialize(code = "reddit_connection_failed", retryable: false)
      @code = code
      @retryable = retryable
      super(code)
    end
  end

  def self.client_id
    ENV["REDDIT_CLIENT_ID"].presence || Rails.application.credentials.dig(:reddit, :client_id)
  end

  def self.client_secret
    ENV["REDDIT_CLIENT_SECRET"].presence || Rails.application.credentials.dig(:reddit, :client_secret)
  end

  def self.configured? = client_id.present? && client_secret.present?

  def self.user_agent
    ENV["REDDIT_USER_AGENT"].presence || "web:codedorian.com:1.0 (by /u/dorianmariecom)"
  end

  def self.scopes
    if DeliveryChannel.where(key: "reddit").exists?(only: [nil, "private"])
      SCOPES + ["privatemessages"]
    else
      SCOPES
    end
  end

  def self.authorization_url(state:, redirect_uri:)
    query = URI.encode_www_form(
      response_type: "code", client_id: client_id, redirect_uri: redirect_uri,
      scope: scopes.join(" "), state: state, duration: "permanent"
    )
    "https://www.reddit.com/api/v1/authorize?#{query}"
  end

  def self.exchange(code:, redirect_uri:)
    data = token_request(grant_type: "authorization_code", code: code, redirect_uri: redirect_uri)
    attributes = token_attributes(data)
    user = get("api/v1/me", token: attributes[:access_token])
    raise Error unless user["id"].present? && user["name"].present?

    attributes.merge(sender: user["id"], name: "Reddit · u/#{user['name']}", enabled: true)
  rescue KeyError
    raise Error
  end

  def self.access_token_for(connection)
    connection.with_lock do
      raise Error, "connection_disabled" unless connection.enabled?

      if connection.token_expires_at && connection.token_expires_at <= 1.minute.from_now
        raise Error, "reddit_reconnect_required" if connection.refresh_token.blank?

        data = token_request(grant_type: "refresh_token", refresh_token: connection.refresh_token)
        attributes = token_attributes(data, refresh_token: connection.refresh_token)
        Current.with(user: connection.user) { connection.update!(attributes) }
      end
      connection.access_token
    end
  end

  def self.token_attributes(data, refresh_token: nil)
    unless data["token_type"].to_s.casecmp?("bearer") && data["access_token"].present? &&
             (data["refresh_token"].presence || refresh_token).present? && data["expires_in"].is_a?(Integer) && data["expires_in"].positive? &&
             (SCOPES - data["scope"].to_s.split).empty?
      raise Error
    end

    { access_token: data["access_token"], refresh_token: data["refresh_token"].presence || refresh_token, token_expires_at: data["expires_in"].seconds.from_now }
  end

  def self.token_request(parameters)
    raise Error, "reddit_not_configured" unless configured?

    uri = URI("https://www.reddit.com/api/v1/access_token")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth(client_id, client_secret)
    request.set_form_data(parameters)
    request_json(request)
  end

  def self.get(path, token:)
    uri = URI("https://oauth.reddit.com/#{path}")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{token}"
    request_json(request)
  end

  def self.request_json(request)
    request["User-Agent"] = user_agent
    response = Http.request(request)
    unless response.is_a?(Net::HTTPSuccess)
      status = response.code.to_i
      raise Error.new("reddit_http_#{status}", retryable: status == 429 || status >= 500)
    end
    data = JSON.parse(response.body)
    raise Error unless data.is_a?(Hash)

    data
  rescue JSON::ParserError, IOError, SystemCallError, Timeout::Error, OpenSSL::SSL::SSLError
    raise Error.new("reddit_connection_failed", retryable: true)
  end
end
