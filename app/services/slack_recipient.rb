# frozen_string_literal: true

class SlackRecipient
  ID_FORMAT = /\A[CDGUW][A-Z0-9]+\z/
  FORMAT = /\A[@#][^\s@#<>]+\z/

  def self.valid?(recipient)
    recipient.to_s.match?(FORMAT) || recipient.to_s.match?(ID_FORMAT)
  end

  def self.resolve(connection, recipient)
    return recipient if recipient.to_s.match?(ID_FORMAT)

    raise DeliveryAdapters::Rejected, "invalid_slack_recipient" unless recipient.to_s.match?(FORMAT)

    key = ["slack-recipient-v1", connection.id, Digest::SHA256.hexdigest(connection.access_token), recipient.downcase]
    Rails.cache.fetch(key, expires_in: 5.minutes) do
      new(connection.access_token).resolve(recipient)
    end
  end

  def initialize(token)
    @token = token
  end

  def resolve(recipient)
    name = recipient.delete_prefix("@").delete_prefix("#").downcase
    if recipient.start_with?("#")
      channel = entries("conversations.list", "channels", types: "public_channel,private_channel", exclude_archived: true)
        .find { |item| item["name"].to_s.downcase == name }
      raise DeliveryAdapters::Rejected, "channel_not_found" unless channel

      channel.fetch("id")
    else
      users = entries("users.list", "members").reject { |user| user["deleted"] || user["is_bot"] }
      matches = users.select { |user| user["name"].to_s.downcase == name }
      if matches.empty?
        matches = users.select { |user| user.dig("profile", "display_name").to_s.downcase == name }
      end
      raise DeliveryAdapters::Rejected, "user_not_found" if matches.empty?
      raise DeliveryAdapters::Rejected, "ambiguous_slack_user" unless matches.one?

      request("conversations.open", { users: matches.first.fetch("id") }, post: true).fetch("channel").fetch("id")
    end
  rescue KeyError, JSON::ParserError, IOError, SystemCallError, Timeout::Error, OpenSSL::SSL::SSLError
    raise DeliveryAdapters::Rejected.new("slack_recipient_lookup_failed", retryable: true)
  end

  private

  def entries(method, key, **parameters)
    results = []
    cursor = nil
    seen = []
    loop do
      data = request(method, parameters.merge(limit: 200, cursor: cursor).compact)
      results.concat(data.fetch(key))
      cursor = data.dig("response_metadata", "next_cursor").presence
      break unless cursor
      raise IOError if seen.include?(cursor)

      seen << cursor
    end
    results
  end

  def request(method, parameters, post: false)
    uri = URI("https://slack.com/api/#{method}")
    uri.query = URI.encode_www_form(parameters) unless post
    request = post ? Net::HTTP::Post.new(uri) : Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{@token}"
    request.set_form_data(parameters) if post
    response = Http.request(request)
    unless response.is_a?(Net::HTTPSuccess)
      raise DeliveryAdapters::Rejected.new("slack_lookup_http_#{response.code}", retryable: response.code == "429" || response.code.to_i >= 500)
    end

    data = JSON.parse(response.body)
    raise IOError unless data.is_a?(Hash)

    unless data["ok"] == true
      error = data.fetch("error", "slack_lookup_failed")
      raise DeliveryAdapters::Rejected.new(error, retryable: error == "ratelimited")
    end

    data
  end
end
