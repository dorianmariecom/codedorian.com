# frozen_string_literal: true

class RedditScript
  class Error < StandardError
    attr_reader :code, :retryable

    def initialize(code = "reddit_connection_failed", retryable: false)
      @code = code
      @retryable = retryable
      super(code)
    end
  end

  def self.username = Config.reddit.to_h[:username]

  def self.configured?
    Config.reddit.client_id.present? && Config.reddit.client_secret.present? &&
      Config.reddit.to_h[:password].present? && username.present?
  end

  def self.access_token
    raise Error, "reddit_not_configured" unless configured?

    request =
      Net::HTTP::Post.new(URI("https://www.reddit.com/api/v1/access_token"))
    request.basic_auth(Config.reddit.client_id, Config.reddit.client_secret)
    request.set_form_data(
      grant_type: "password",
      username: username,
      password: Config.reddit.to_h[:password]
    )
    data = request_json(request)
    unless data["token_type"].to_s.casecmp?("bearer") &&
             data["access_token"].present?
      raise Error
    end

    token = data.fetch("access_token")
    request = Net::HTTP::Get.new(URI("https://oauth.reddit.com/api/v1/me"))
    request["Authorization"] = "Bearer #{token}"
    unless request_json(request)["name"].to_s.casecmp?(username)
      raise Error, "reddit_invalid_sender"
    end

    token
  end

  def self.compose(recipient:, subject:, text:)
    target = RedditRecipient.resolve(recipient, public: false)
    request = Net::HTTP::Post.new(URI("https://oauth.reddit.com/api/compose"))
    request["Authorization"] = "Bearer #{access_token}"
    request.set_form_data(
      api_type: "json",
      to: target,
      subject: subject.truncate(100),
      text: text
    )
    response = request_json(request, submitted: true)
    unless response["json"].is_a?(Hash) &&
             response["json"]["errors"].is_a?(Array)
      raise IOError, "Reddit response is incomplete"
    end

    return if response["json"]["errors"].blank?

    code = response["json"]["errors"].first.first.to_s
    raise Error.new("reddit_#{code.downcase}", retryable: code == "RATELIMIT")
  end

  def self.request_json(request, submitted: false)
    request["User-Agent"] = "web:codedorian.com:1.0 (by /u/#{username})"
    response = Http.request(request)
    unless response.is_a?(Net::HTTPSuccess)
      status = response.code.to_i
      if submitted && status >= 500
        raise IOError, "Reddit delivery response is uncertain"
      end

      raise Error.new(
              "reddit_http_#{status}",
              retryable: status == 429 || status >= 500
            )
    end
    data = JSON.parse(response.body)
    unless data.is_a?(Hash)
      raise IOError, "Reddit response is incomplete" if submitted

      raise Error
    end

    data
  rescue JSON::ParserError,
         IOError,
         SystemCallError,
         Timeout::Error,
         OpenSSL::SSL::SSLError
    raise if submitted

    raise Error.new("reddit_connection_failed", retryable: true)
  end
end
