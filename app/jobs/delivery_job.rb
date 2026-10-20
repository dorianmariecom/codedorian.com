# frozen_string_literal: true

class DeliveryJob < ApplicationJob
  def perform(delivery_id:)
    delivery = Delivery.find_by(id: delivery_id)
    return unless delivery&.claim!

    channel = delivery.delivery_destination.delivery_channel
    Current.with(
      user: delivery.service.user,
      subscription: delivery.subscription,
      locale: delivery.locale
    ) { delivery.receive_result!(channel.deliver(delivery: delivery)) }
  rescue DeliveryChannel::Rejected => e
    delivery.reject!(error: e)
  rescue StandardError => e
    delivery&.with_lock { delivery.uncertain!(error: e) if delivery.sending? }
    raise
  end
end
