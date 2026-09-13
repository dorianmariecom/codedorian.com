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
    raise ArgumentError, "A stable event key is required" if key.blank?
    unless Current.user&.admin? || Current.user == subscription.service.user ||
             Current.user == subscription.user
      raise Pundit::NotAuthorizedError
    end
    return [] unless subscription.active?

    deliveries =
      subscription.with_lock do
        subscription
          .subscription_destinations
          .active
          .selected
          .preload(:delivery_destination)
          .filter_map do |selection|
            destination = selection.delivery_destination

            subscription
              .deliveries
              .find_or_create_by!(
                event_key_digest: Digest::SHA256.hexdigest(key.to_s),
                delivery_destination: destination
              ) do |delivery|
                delivery.event_key = key.to_s
                delivery.subject = subject.to_s
                delivery.body_text = body_text.to_s
                delivery.body_html = body_html
                delivery.url = url
                delivery.locale = subscription.user.locale.to_s
                delivery.channel = destination.channel
                delivery.recipient = destination.recipient
                delivery.visibility = destination.visibility
                delivery.connection = destination.connection
                delivery.step_execution = Current.step_execution
              end
          end
      end
    deliveries.each do |delivery|
      delivery.enqueue if delivery.previously_new_record?
    end
    deliveries
  end
end
