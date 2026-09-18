# frozen_string_literal: true

class RedditRecipient
  USER_FORMAT = %r{\A(?:u/|@)?[a-zA-Z0-9_-]{3,20}\z}
  COMMUNITY_FORMAT = %r{\A(?:r/|#)?[a-zA-Z0-9_]{2,21}\z}

  def self.valid?(recipient, public:)
    recipient.to_s.match?(public ? COMMUNITY_FORMAT : USER_FORMAT)
  end

  def self.resolve(recipient, public:)
    unless valid?(recipient, public: public)
      raise DeliveryAdapters::Rejected, "invalid_reddit_recipient"
    end

    if public
      recipient.delete_prefix("r/").delete_prefix("#")
    else
      recipient.delete_prefix("u/").delete_prefix("@")
    end
  end
end
