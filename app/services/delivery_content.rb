# frozen_string_literal: true

class DeliveryContent
  DEFAULT_LIMIT = 40_000
  X_PUBLIC_LIMIT = 280
  X_PRIVATE_LIMIT = 10_000
  X_RECIPIENT_PREFIXES = %w[@ #].freeze
  RECIPIENT_SEPARATOR = " "
  TEXT_SEPARATOR = "\n\n"
  OMISSION = "..."
  MINIMUM_LIMIT = OMISSION.length + 1
  LINK_OVERHEAD = OMISSION.length + TEXT_SEPARATOR.length
  LINK_PREFIX = "https://"

  LIMITS = {
    "push" => 2000,
    "slack" => 4000,
    "github" => 65_536,
    "mastodon" => 400,
    "reddit" => 10_000
  }.freeze

  def self.limit_for(delivery)
    unless delivery.channel == "x"
      return LIMITS.fetch(delivery.channel, DEFAULT_LIMIT)
    end
    return X_PRIVATE_LIMIT unless delivery.visibility_public?

    limit = X_PUBLIC_LIMIT
    recipient = delivery.recipient.to_s
    limit -=
      recipient.length + RECIPIENT_SEPARATOR.length if recipient.start_with?(
      *X_RECIPIENT_PREFIXES
    )
    limit
  end

  def self.compact(text:, limit:, url: nil)
    raise Code::Error, "invalid content limit" unless limit >= MINIMUM_LIMIT
    return text if text.length <= limit
    unless url.present? && url.start_with?(LINK_PREFIX) &&
             url.length + LINK_OVERHEAD < limit
      return nil
    end

    "#{text.truncate(limit - url.length - TEXT_SEPARATOR.length, omission: OMISSION)}#{TEXT_SEPARATOR}#{url}"
  end
end
