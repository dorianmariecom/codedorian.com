# frozen_string_literal: true

class FacebookOauth
  class Error < StandardError
    attr_reader :reason, :stage, :provider_code, :provider_subcode

    def initialize(reason = "failed", stage: nil, provider_code: nil, provider_subcode: nil)
      @reason = reason
      @stage = stage
      @provider_code = provider_code if provider_code.is_a?(Integer)
      @provider_subcode = provider_subcode if provider_subcode.is_a?(Integer)
      super(reason)
    end
  end

  SCOPES = %w[pages_show_list pages_read_engagement pages_manage_posts].freeze
  PUBLISHING_TASKS = %w[CREATE_CONTENT MANAGE PROFILE_PLUS_CREATE_CONTENT PROFILE_PLUS_FULL_CONTROL PROFILE_PLUS_MANAGE].freeze

  def self.client_id
    ENV["FACEBOOK_CLIENT_ID"].presence || ENV["META_DELIVERY_APP_ID"].presence || Rails.application.credentials.dig(:facebook, :client_id)
  end

  def self.client_secret
    ENV["FACEBOOK_CLIENT_SECRET"].presence || ENV["META_DELIVERY_APP_SECRET"].presence || Rails.application.credentials.dig(:facebook, :client_secret)
  end

  def self.config_id
    ENV["FACEBOOK_CONFIG_ID"].presence || Rails.application.credentials.dig(:facebook, :config_id)
  end

  def self.api_version
    ENV["META_DELIVERY_API_VERSION"].presence || Rails.application.credentials.dig(:meta_delivery, :api_version)
  end

  def self.configured?
    client_id.present? && client_secret.present? && config_id.present? && api_version.to_s.match?(/\Av[0-9]+\.0\z/)
  end

  def self.authorization_url(state:, redirect_uri:)
    raise Error unless configured?

    query = URI.encode_www_form(client_id: client_id, config_id: config_id, response_type: "code", override_default_response_type: true, auth_type: "rerequest", state: state, redirect_uri: redirect_uri)
    "https://www.facebook.com/#{api_version}/dialog/oauth?#{query}"
  end

  def self.exchange(code:, redirect_uri:)
    pages(exchange_token(code: code, redirect_uri: redirect_uri))
  end

  def self.exchange_token(code:, redirect_uri:)
    raise Error unless configured?

    short = get("oauth/access_token", stage: "code_exchange", params: { client_id: client_id, client_secret: client_secret, code: code, redirect_uri: redirect_uri })
    raise Error unless short["access_token"].is_a?(String) && short["access_token"].present?

    long = get("oauth/access_token", stage: "long_lived_token", params: { client_id: client_id, client_secret: client_secret, grant_type: "fb_exchange_token", fb_exchange_token: short["access_token"] })
    token = long["access_token"]
    raise Error unless token.is_a?(String) && token.present?

    token
  end
  private_class_method :exchange_token

  def self.pages(token)
    permissions = get("me/permissions", token: token)["data"]
    raise Error unless permissions.is_a?(Array) && permissions.all?(Hash)

    granted = permissions.select { |permission| permission["status"] == "granted" }.pluck("permission")
    raise Error, "missing_permissions" unless (SCOPES - granted).empty?

    accounts = []
    page_count = 0
    publishing_page_count = 0
    cursor = nil
    seen = []
    loop do
      data = get("me/accounts", token: token, params: { fields: "id,name,access_token,tasks", limit: 100, after: cursor }.compact)
      pages = data["data"]
      raise Error unless pages.is_a?(Array) && pages.all?(Hash)

      page_count += pages.length
      pages.each do |page|
        next unless page["tasks"].is_a?(Array) && page["tasks"].intersect?(PUBLISHING_TASKS)

        publishing_page_count += 1
        raise Error unless page["id"].is_a?(String) && page["id"].match?(/\A[0-9]+\z/) && page["access_token"].is_a?(String) && page["access_token"].present?

        accounts << { sender: page["id"], name: "Facebook · #{page['name'].presence || page['id']}", access_token: page["access_token"], enabled: true }
      end
      paging = data["paging"]
      raise Error unless paging.nil? || paging.is_a?(Hash)
      break unless paging && paging["next"].present?

      cursors = paging["cursors"]
      raise Error unless cursors.is_a?(Hash)

      cursor = cursors["after"]
      raise Error unless cursor.is_a?(String) && cursor.present? && !seen.include?(cursor) && seen.length < 100

      seen << cursor
    end
    accounts = selected_pages(token) if page_count.zero?
    if accounts.empty?
      Rails.logger.warn("Facebook OAuth pages: returned=#{page_count} publishing=#{publishing_page_count}")
      raise Error, "no_pages"
    end

    accounts.uniq { |account| account[:sender] }
  end

  private_class_method :pages

  # Business Login can grant Page IDs without exposing them through /me/accounts.
  def self.selected_pages(token)
    metadata = get("debug_token", params: { input_token: token }, token: "#{client_id}|#{client_secret}")["data"]
    unless metadata.is_a?(Hash) && metadata["is_valid"] == true && metadata["type"] == "USER" && metadata["app_id"].to_s == client_id.to_s
      raise Error.new("provider_error", stage: "page_grant")
    end

    grants = metadata["granular_scopes"]
    return [] unless grants.is_a?(Array) && grants.all?(Hash)

    publishing = grants.find { |grant| grant["scope"] == "pages_manage_posts" }
    return [] unless publishing && publishing["target_ids"].is_a?(Array)

    page_ids = publishing["target_ids"]
    raise Error.new("provider_error", stage: "page_grant") unless page_ids.all? { |id| id.is_a?(String) && id.match?(/\A[0-9]+\z/) } && page_ids.length <= 100

    page_ids.uniq.map do |id|
      page = get(id, params: { fields: "id,name,access_token" }, token: token, stage: "selected_page")
      unless page["id"] == id && page["access_token"].is_a?(String) && page["access_token"].present?
        raise Error.new("provider_error", stage: "selected_page")
      end

      { sender: id, name: "Facebook · #{page['name'].presence || id}", access_token: page["access_token"], enabled: true }
    end
  end
  private_class_method :selected_pages

  def self.get(path, params: {}, token: nil, stage: path, secret: client_secret)
    uri = URI("https://graph.facebook.com/#{api_version}/#{path}")
    params = params.merge(appsecret_proof: OpenSSL::HMAC.hexdigest("SHA256", secret, token)) if token
    uri.query = URI.encode_www_form(params) if params.any?
    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{token}" if token
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 10, read_timeout: 30, write_timeout: 30) { |http| http.request(request) }
    data = JSON.parse(response.body)
    provider_error = data.is_a?(Hash) && data["error"].is_a?(Hash) ? data["error"] : {}
    unless response.is_a?(Net::HTTPSuccess) && data.is_a?(Hash) && !data.key?("error")
      raise Error.new("provider_error", stage: stage, provider_code: provider_error["code"], provider_subcode: provider_error["error_subcode"])
    end

    data
  rescue JSON::ParserError, IOError, SystemCallError, Timeout::Error, OpenSSL::SSL::SSLError
    raise Error.new("failed", stage: stage)
  end
  private_class_method :get
end
