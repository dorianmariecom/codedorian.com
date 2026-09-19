# frozen_string_literal: true

class MastodonOauth
  SCOPES = %w[read:accounts write:statuses].freeze

  class Error < StandardError; end

  def self.origin(server)
    raise Error unless server.is_a?(String) && server.present?

    uri = URI.parse(server.include?("://") ? server.strip : "https://#{server.strip}")
    unless uri.is_a?(URI::HTTPS) && uri.host.present? && uri.port == 443 &&
             uri.userinfo.nil? && uri.query.nil? && uri.fragment.nil? && uri.path.in?(["", "/"])
      raise Error
    end

    "https://#{uri.host.downcase}"
  rescue URI::InvalidURIError
    raise Error
  end

  def self.register(server:, redirect_uri:)
    base_url = origin(server)
    data = post(base_url, "/api/v1/apps", client_name: "codedorian.com", redirect_uris: redirect_uri, scopes: SCOPES.join(" "))
    raise Error unless data["client_id"].is_a?(String) && data["client_id"].present? && data["client_secret"].is_a?(String) && data["client_secret"].present?

    { "base_url" => base_url, "client_id" => data["client_id"], "client_secret" => ActiveRecord::Encryption.encryptor.encrypt(data["client_secret"]) }
  end

  def self.authorization_url(registration:, state:, redirect_uri:)
    query = URI.encode_www_form(response_type: "code", client_id: registration.fetch("client_id"), redirect_uri: redirect_uri, scope: SCOPES.join(" "), state: state)
    "#{origin(registration.fetch('base_url'))}/oauth/authorize?#{query}"
  end

  def self.exchange(registration:, code:, redirect_uri:)
    base_url = origin(registration.fetch("base_url"))
    data = post(base_url, "/oauth/token", grant_type: "authorization_code", code: code,
      client_id: registration.fetch("client_id"), client_secret: ActiveRecord::Encryption.encryptor.decrypt(registration.fetch("client_secret")),
      redirect_uri: redirect_uri, scope: SCOPES.join(" "))
    unless data["access_token"].is_a?(String) && data["access_token"].present? &&
             data["token_type"].to_s.casecmp?("bearer") && (SCOPES - data["scope"].to_s.split).empty?
      raise Error
    end

    uri = URI("#{base_url}/api/v1/accounts/verify_credentials")
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{data['access_token']}"
    account = request_json(uri, request)
    raise Error unless account["id"].present? && account["username"].present?

    { scope: data["scope"].to_s.split.join(" "), base_url: base_url, sender: account["id"], name: "Mastodon · @#{account['username']}@#{uri.host}", access_token: data["access_token"], enabled: true }
  rescue KeyError, ActiveRecord::Encryption::Errors::Decryption
    raise Error
  end

  def self.post(base_url, path, parameters)
    uri = URI("#{base_url}#{path}")
    request = Net::HTTP::Post.new(uri)
    request.set_form_data(parameters)
    request_json(uri, request)
  end

  def self.request_json(uri, request)
    response = Http.request(request, ipaddr: DeliveryProviderAddress.resolve!(uri.host), proxy: nil)
    raise Error unless response.is_a?(Net::HTTPSuccess)

    data = JSON.parse(response.body)
    raise Error unless data.is_a?(Hash)

    data
  rescue DeliveryAdapters::Rejected, Resolv::ResolvError, JSON::ParserError, IOError, SystemCallError, Timeout::Error, OpenSSL::SSL::SSLError
    raise Error
  end
end
