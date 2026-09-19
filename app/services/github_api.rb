# frozen_string_literal: true

class GithubApi
  def self.headers(token)
    {
      "Authorization" => "Bearer #{token}",
      "Accept" => "application/vnd.github+json",
      "X-GitHub-Api-Version" => "2026-03-10",
      "User-Agent" => "codedorian.com"
    }
  end

  def self.get(url, token:, query: {})
    uri = URI.parse(url)
    unless uri.scheme == "https" && uri.host == "api.github.com" && uri.port == 443 && uri.userinfo.nil? && uri.fragment.nil?
      raise GithubOauth::Error, "invalid_github_url"
    end

    uri.query = URI.encode_www_form(query) if query.present?
    request_json(Net::HTTP::Get.new(uri, headers(token)))
  rescue URI::InvalidURIError
    raise GithubOauth::Error, "invalid_github_url"
  end

  def self.request_json(request)
    request["User-Agent"] = "codedorian.com"
    response = Http.request(request, max_retries: 0)
    unless response.is_a?(Net::HTTPSuccess)
      status = response.code.to_i
      limited = status == 429 || (status == 403 && (response["X-RateLimit-Remaining"] == "0" || response["Retry-After"].present?))
      raise GithubOauth::Error.new("github_http_#{status}", retryable: limited || status >= 500)
    end
    data = JSON.parse(response.body)
    raise GithubOauth::Error unless data.is_a?(Hash) || data.is_a?(Array)

    data
  rescue JSON::ParserError, IOError, SystemCallError, Timeout::Error, OpenSSL::SSL::SSLError
    raise GithubOauth::Error.new("github_connection_failed", retryable: true)
  end
end
