# frozen_string_literal: true

class XOauth
  SCOPES = %w[
    tweet.read
    tweet.write
    users.read
    dm.read
    dm.write
    offline.access
  ].freeze

  class Error < StandardError
    attr_reader :code, :retryable

    def initialize(code = "x_connection_failed", retryable: false)
      @code = code
      @retryable = retryable
      super(code)
    end
  end

  def self.client_id
    Config.x.client_id
  end

  def self.client_secret
    Config.x.client_secret
  end

  def self.configured? = client_id.present? && client_secret.present?

  def self.authorization_url(state:, verifier:, redirect_uri:)
    query =
      URI.encode_www_form(
        response_type: "code",
        client_id: client_id,
        redirect_uri: redirect_uri,
        scope: SCOPES.join(" "),
        state: state,
        code_challenge:
          Base64.urlsafe_encode64(
            Digest::SHA256.digest(verifier),
            padding: false
          ),
        code_challenge_method: "S256"
      )
    "https://x.com/i/oauth2/authorize?#{query}"
  end

  def self.exchange(code:, verifier:, redirect_uri:)
    data =
      token_request(
        grant_type: "authorization_code",
        code: code,
        code_verifier: verifier,
        redirect_uri: redirect_uri
      )
    attributes = token_attributes(data)
    user = get("users/me", token: attributes[:access_token]).fetch("data")
    raise Error unless user["id"].present? && user["username"].present?

    attributes.merge(
      sender: user["id"],
      **DeliveryConnectionOauth.identity(
        username: user["username"],
        external_id: user["id"]
      ),
      enabled: true
    )
  rescue KeyError
    raise Error
  end

  def self.access_token_for(connection)
    connection.with_lock do
      raise Error, "connection_disabled" unless connection.enabled?

      if connection.token_expires_at &&
           connection.token_expires_at <= 1.minute.from_now
        raise Error, "x_reconnect_required" if connection.refresh_token.blank?

        data =
          token_request(
            grant_type: "refresh_token",
            refresh_token: connection.refresh_token
          )
        attributes = token_attributes(data)
        Current.with(user: connection.user) { connection.update!(attributes) }
      end
      connection.access_token
    end
  end

  def self.token_attributes(data)
    unless data["token_type"].to_s.casecmp?("bearer") &&
             data["access_token"].present? && data["refresh_token"].present? &&
             data["expires_in"].is_a?(Integer) &&
             data["expires_in"].positive? &&
             (SCOPES - data["scope"].to_s.split).empty?
      raise Error
    end

    {
      scope: data["scope"].to_s.split.join(" "),
      access_token: data["access_token"],
      refresh_token: data["refresh_token"],
      token_expires_at: data["expires_in"].seconds.from_now
    }
  end

  def self.token_request(parameters)
    raise Error, "x_not_configured" unless configured?

    uri = URI("https://api.x.com/2/oauth2/token")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth(client_id, client_secret)
    request.set_form_data(parameters.merge(client_id: client_id))
    request_json(request)
  end

  def self.get(path, token:)
    uri = URI("https://api.x.com/2/#{path}")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{token}"
    request_json(request)
  end

  def self.request_json(request)
    response = Http.request(request)
    unless response.is_a?(Net::HTTPSuccess)
      status = response.code.to_i
      raise Error.new(
              "x_http_#{status}",
              retryable: status == 429 || status >= 500
            )
    end
    data = JSON.parse(response.body)
    raise Error unless data.is_a?(Hash)

    data
  rescue JSON::ParserError,
         IOError,
         SystemCallError,
         Timeout::Error,
         OpenSSL::SSL::SSLError
    raise Error.new("x_connection_failed", retryable: true)
  end
end
