# frozen_string_literal: true

class FacebookOauth
  META_API_VERSION = "v26.0"

  class Error < StandardError
    attr_reader :reason, :stage, :provider_code, :provider_subcode

    def initialize(
      reason = "failed",
      stage: nil,
      provider_code: nil,
      provider_subcode: nil
    )
      @reason = reason
      @stage = stage
      @provider_code = provider_code if provider_code.is_a?(Integer)
      @provider_subcode = provider_subcode if provider_subcode.is_a?(Integer)
      super(reason)
    end
  end

  SCOPES = %w[public_profile].freeze

  def self.client_id
    Config.facebook.client_id
  end

  def self.client_secret
    Config.facebook.client_secret
  end

  def self.configured?
    client_id.present? && client_secret.present?
  end

  def self.authorization_url(state:, redirect_uri:)
    raise Error unless configured?

    query =
      URI.encode_www_form(
        client_id: client_id,
        response_type: "code",
        state: state,
        redirect_uri: redirect_uri
      )
    "https://www.facebook.com/#{META_API_VERSION}/dialog/oauth?#{query}"
  end

  def self.exchange(code:, redirect_uri:)
    raise Error unless configured?

    data =
      get(
        "oauth/access_token",
        stage: "code_exchange",
        params: {
          client_id: client_id,
          client_secret: client_secret,
          code: code,
          redirect_uri: redirect_uri
        }
      )
    token = data["access_token"]
    raise Error unless token.is_a?(String) && token.present?

    user = get("me", token: token, params: { fields: "id,name" })
    unless user["id"].is_a?(String) && user["id"].match?(/\A[0-9]+\z/)
      raise Error
    end

    name = user["name"].is_a?(String) ? user["name"].presence : nil

    [
      {
        sender: user["id"],
        name: "Facebook · #{name || user["id"]}",
        access_token: token,
        scope: SCOPES.join(" "),
        enabled: true
      }
    ]
  end

  def self.get(path, params: {}, token: nil, stage: path, secret: client_secret)
    uri = URI("https://graph.facebook.com/#{META_API_VERSION}/#{path}")
    if token
      params =
        params.merge(
          appsecret_proof: OpenSSL::HMAC.hexdigest("SHA256", secret, token)
        )
    end
    uri.query = URI.encode_www_form(params) if params.any?
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{token}" if token
    response = Http.request(request)
    data = JSON.parse(response.body)
    provider_error =
      data.is_a?(Hash) && data["error"].is_a?(Hash) ? data["error"] : {}
    unless response.is_a?(Net::HTTPSuccess) && data.is_a?(Hash) &&
             !data.key?("error")
      raise Error.new(
              "provider_error",
              stage: stage,
              provider_code: provider_error["code"],
              provider_subcode: provider_error["error_subcode"]
            )
    end

    data
  rescue JSON::ParserError,
         IOError,
         SystemCallError,
         Timeout::Error,
         OpenSSL::SSL::SSLError
    raise Error.new("failed", stage: stage)
  end
  private_class_method :get
end
