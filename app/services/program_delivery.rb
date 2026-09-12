# frozen_string_literal: true

class ProgramDelivery
  def self.call(
    subscription:,
    key:,
    subject:,
    body_text:,
    body_html: nil,
    url: nil
  )
    if key.blank? || key.to_s.length > 4096
      raise ArgumentError, "A stable event key is required"
    end
    unless Current.user&.admin? || Current.user == subscription.service.user ||
             Current.user == subscription.user
      raise Pundit::NotAuthorizedError
    end
    return [] unless subscription.active?

    key = "sha256:#{Digest::SHA256.hexdigest(key.to_s)}" if key.to_s.length >
      255
    payload = {
      subject: subject.to_s,
      body_text: body_text.to_s,
      body_html: body_html,
      url: url,
      locale: subscription.user.locale.to_s
    }
    subscription.with_lock do
      subscription
        .subscription_destinations
        .where(active: true, selected: true)
        .includes(:delivery_destination)
        .filter_map do |selection|
          destination = selection.delivery_destination

          subscription
            .deliveries
            .find_or_create_by!(
              event_key: key.to_s,
              delivery_destination: destination
            ) do |delivery|
              delivery.payload = payload
              delivery.destination_snapshot = destination.snapshot
              delivery.step_execution = Current.step_execution
            end
        end
    end
  end
end
