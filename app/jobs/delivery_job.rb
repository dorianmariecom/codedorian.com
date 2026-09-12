# frozen_string_literal: true

class DeliveryJob < ApplicationJob
  def perform(delivery_id:)
    delivery = Delivery.find_by(id: delivery_id)
    return unless delivery

    claimed =
      delivery.with_lock do
        next false unless delivery.status == "pending"
        next false if delivery.next_attempt_at&.future?

        unless delivery.subscription.active? &&
                 delivery.subscription.subscription_destinations.exists?(
                   delivery_destination_id: delivery.delivery_destination_id,
                   active: true,
                   selected: true
                 )
          delivery.update!(status: "canceled")
          next false
        end
        unless delivery.delivery_destination.available?
          delivery.update!(
            status: "failed",
            error_code: "destination_unavailable"
          )
          next false
        end
        delivery.update!(status: "sending", attempts: delivery.attempts + 1)
        true
      end
    return unless claimed

    Current.with(
      user: delivery.subscription.service.user,
      subscription: delivery.subscription,
      locale: delivery.payload.fetch("locale", "en")
    ) do
      result = DeliveryAdapters.deliver(delivery)
      delivery.with_lock do
        if delivery.status == "sending"
          delivery.update!(
            status: result.fetch(:status, "accepted"),
            provider_id: result[:provider_id],
            error_code: nil
          )
        end
      end
    end
  rescue DeliveryAdapters::Rejected => e
    delivery.with_lock do
      if e.retryable && delivery.attempts < 5
        delivery.update!(
          status: "pending",
          error_code: e.code,
          next_attempt_at: Time.current + (2**delivery.attempts).minutes
        )
      else
        delivery.update!(status: "failed", error_code: e.code)
      end
    end
  rescue StandardError => e
    delivery&.update!(status: "uncertain", error_code: e.class.name)
    raise
  end
end
