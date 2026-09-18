# frozen_string_literal: true

class WebhookRecipient
  def self.valid?(recipient)
    uri = URI.parse(recipient.to_s)
    uri.is_a?(URI::HTTPS) && uri.host.present? && uri.userinfo.nil? &&
      uri.fragment.nil?
  rescue URI::InvalidURIError
    false
  end
end
