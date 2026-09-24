# frozen_string_literal: true

class SlackOauth
  class Error < StandardError
  end

  SCOPES = %w[chat:write users:read channels:read groups:read im:write].freeze

  def self.client_id
    Config.slack.client_id
  end

  def self.client_secret
    Config.slack.client_secret
  end

  def self.configured? = client_id.present? && client_secret.present?

  def self.authorization_url(state:, redirect_uri:)
    "https://slack.com/oauth/v2/authorize?#{URI.encode_www_form(client_id: client_id, scope: SCOPES.join(","), user_scope: SCOPES.join(","), state: state, redirect_uri: redirect_uri)}"
  end

  def self.exchange(code:, redirect_uri:)
    raise Error unless configured?

    uri = URI("https://slack.com/api/oauth.v2.access")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth(client_id, client_secret)
    request.set_form_data(code: code, redirect_uri: redirect_uri)
    response = Http.request(request)
    raise Error unless response.is_a?(Net::HTTPSuccess)

    data = JSON.parse(response.body)
    raise Error unless data.is_a?(Hash) && data["ok"] == true

    user = data["authed_user"]
    team = data["team"]
    raise Error unless user.is_a?(Hash) && team.is_a?(Hash)
    unless data["access_token"].present? && data["token_type"] == "bot" &&
             data["bot_user_id"].present? && user["id"].present? &&
             team["id"].present? &&
             data["scope"].to_s.split(",").include?("chat:write") &&
             user["access_token"].present? &&
             user["scope"].to_s.split(",").include?("chat:write") &&
             data["expires_in"].nil? && user["expires_in"].nil?
      raise Error
    end

    [
      {
        account_sid: team["id"],
        sender: data["bot_user_id"],
        external_id: data["bot_user_id"],
        scope: data["scope"].to_s.split(",").join(" "),
        access_token: data["access_token"],
        enabled: true
      },
      {
        account_sid: team["id"],
        sender: user["id"],
        external_id: user["id"],
        scope: user["scope"].to_s.split(",").join(" "),
        access_token: user["access_token"],
        enabled: true
      }
    ]
  rescue JSON::ParserError,
         IOError,
         SystemCallError,
         Timeout::Error,
         OpenSSL::SSL::SSLError
    raise Error
  end
end
