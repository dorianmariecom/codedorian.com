# frozen_string_literal: true

class GithubOauth
  SCOPES = %w[repo notifications].freeze

  class Error < StandardError
    attr_reader :code, :retryable

    def initialize(code = "github_connection_failed", retryable: false)
      @code = code
      @retryable = retryable
      super(code)
    end
  end

  def self.client_id
    Config.github.client_id
  end

  def self.client_secret
    Config.github.client_secret
  end

  def self.configured? = client_id.present? && client_secret.present?

  def self.authorization_url(state:, verifier:, redirect_uri:)
    raise Error, "github_not_configured" unless configured?

    query =
      URI.encode_www_form(
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
    "https://github.com/login/oauth/authorize?#{query}"
  end

  def self.exchange(code:, verifier:, redirect_uri:)
    data =
      token_request(
        code: code,
        code_verifier: verifier,
        redirect_uri: redirect_uri
      )
    attributes = token_attributes(data)
    user =
      GithubApi.get(
        "https://api.github.com/user",
        token: attributes.fetch(:access_token)
      )
    unless user.is_a?(Hash) && user["id"].is_a?(Integer) &&
             user["id"].positive? && user["login"].is_a?(String) &&
             user["login"].present?
      raise Error
    end

    attributes.merge(
      sender: user["id"].to_s,
      **DeliveryConnectionOauth.identity(
        email: user["email"],
        username: user["login"],
        external_id: user["id"]
      ),
      enabled: true
    )
  end

  def self.access_token_for(connection)
    connection.with_lock do
      unless connection.enabled? && connection.provider == "github"
        raise Error, "connection_disabled"
      end

      if connection.token_expires_at &&
           connection.token_expires_at <= 1.minute.from_now
        if connection.refresh_token.blank?
          raise Error, "github_reconnect_required"
        end

        data =
          token_request(
            grant_type: "refresh_token",
            refresh_token: connection.refresh_token
          )
        Current.with(user: connection.user) do
          connection.update!(token_attributes(data))
        end
      end
      raise Error, "github_reconnect_required" if connection.access_token.blank?

      connection.access_token
    end
  end

  def self.token_attributes(data)
    unless data.is_a?(Hash) && data["token_type"].to_s.casecmp?("bearer") &&
             data["access_token"].is_a?(String) &&
             data["access_token"].present? &&
             (SCOPES - data["scope"].to_s.split(/[ ,]+/)).empty?
      raise Error
    end

    expires_in = data["expires_in"]
    if expires_in &&
         (
           !expires_in.is_a?(Integer) || !expires_in.positive? ||
             !data["refresh_token"].is_a?(String) ||
             data["refresh_token"].blank?
         )
      raise Error
    end

    {
      scope: data["scope"].to_s.split(/[ ,]+/).join(" "),
      access_token: data["access_token"],
      refresh_token: data["refresh_token"],
      token_expires_at: expires_in&.seconds&.from_now
    }
  end

  def self.token_request(parameters)
    raise Error, "github_not_configured" unless configured?

    request =
      Net::HTTP::Post.new(URI("https://github.com/login/oauth/access_token"))
    request["Accept"] = "application/json"
    request.set_form_data(
      parameters.merge(client_id: client_id, client_secret: client_secret)
    )
    GithubApi.request_json(request)
  end
end
