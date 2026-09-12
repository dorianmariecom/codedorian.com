# frozen_string_literal: true

class DeliveryJob < ApplicationJob
  def perform(delivery_id:)
    delivery = Delivery.find_by(id: delivery_id)
    return unless delivery&.claim!

    Current.with(
      user: delivery.service.user,
      subscription: delivery.subscription,
      locale: delivery.locale
    ) { delivery.receive_result!(DeliveryAdapters.deliver(delivery)) }
  rescue DeliveryAdapters::Rejected => e
    delivery.reject!(error: e)
  rescue StandardError => e
    delivery&.with_lock { delivery.uncertain!(error: e) if delivery.sending? }
    raise
  end
end
