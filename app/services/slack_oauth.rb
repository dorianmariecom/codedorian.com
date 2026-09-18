# frozen_string_literal: true

class SlackOauth
  class Error < StandardError; end

  SCOPES = %w[chat:write users:read channels:read groups:read im:write].freeze

  def self.client_id
    ENV["SLACK_CLIENT_ID"].presence || Rails.application.credentials.dig(:slack, :client_id)
  end

  def self.client_secret
    ENV["SLACK_CLIENT_SECRET"].presence || Rails.application.credentials.dig(:slack, :client_secret)
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
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 10, read_timeout: 30, write_timeout: 30) do |http|
      http.request(request)
    end
    raise Error unless response.is_a?(Net::HTTPSuccess)

    data = JSON.parse(response.body)
    raise Error unless data.is_a?(Hash) && data["ok"] == true

    user = data["authed_user"]
    team = data["team"]
    raise Error unless user.is_a?(Hash) && team.is_a?(Hash)
    unless data["access_token"].present? && data["token_type"] == "bot" &&
             data["bot_user_id"].present? && user["id"].present? && team["id"].present? &&
             data["scope"].to_s.split(",").include?("chat:write") &&
             user["access_token"].present? && user["scope"].to_s.split(",").include?("chat:write") &&
             data["expires_in"].nil? && user["expires_in"].nil?
      raise Error
    end

    workspace = team["name"].presence || team["id"]
    [
      {
        account_sid: team["id"], sender: data["bot_user_id"],
        name: "Slack · #{workspace} · #{I18n.t('slack_connections.senders.bot')}",
        access_token: data["access_token"], enabled: true
      },
      {
        account_sid: team["id"], sender: user["id"],
        name: "Slack · #{workspace} · #{I18n.t('slack_connections.senders.user')} · #{user['id']}",
        access_token: user["access_token"], enabled: true
      }
    ]
  rescue JSON::ParserError, IOError, SystemCallError, Timeout::Error, OpenSSL::SSL::SSLError
    raise Error
  end
end
