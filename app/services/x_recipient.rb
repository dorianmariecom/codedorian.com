# frozen_string_literal: true

class XRecipient
  ID_FORMAT = /\A[0-9]+\z/
  USER_FORMAT = /\A@[a-zA-Z0-9_]{1,15}\z/
  HASHTAG_FORMAT = /\A#[\p{L}\p{N}_]+\z/

  def self.valid?(recipient, public:)
    return true if public && recipient.blank?
    return true if recipient.to_s.match?(ID_FORMAT)
    return true if recipient.to_s.match?(USER_FORMAT)

    public && recipient.to_s.match?(HASHTAG_FORMAT)
  end

  def self.resolve(connection, recipient)
    return recipient if recipient.to_s.match?(ID_FORMAT)

    unless recipient.to_s.match?(USER_FORMAT)
      raise DeliveryAdapters::Rejected, "invalid_x_recipient"
    end

    key = [
      "x-recipient-v1",
      connection.id,
      Digest::SHA256.hexdigest(connection.access_token),
      recipient.downcase
    ]
    Rails
      .cache
      .fetch(key, expires_in: 5.minutes) do
        data =
          XOauth.get(
            "users/by/username/#{recipient.delete_prefix("@")}",
            token: connection.access_token
          )
        id = data.dig("data", "id")
        unless id.to_s.match?(/\A\d+\z/)
          raise DeliveryAdapters::Rejected, "x_user_not_found"
        end

        id
      end
  rescue XOauth::Error => e
    raise DeliveryAdapters::Rejected.new(e.code, retryable: e.retryable)
  end
end
