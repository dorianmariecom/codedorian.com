# frozen_string_literal: true

require_relative "../../db/migrate/20261020192337_populate_delivery_inputs"

module DeliveryProgramHelper
  def delivery_input_for(key)
    PopulateDeliveryInputs.programs.fetch(key.to_s)
  end

  def deliver_code(delivery)
    channel = delivery.delivery_destination.delivery_channel
    channel.delivery_input = delivery_input_for(delivery.channel)
    channel.deliver(delivery: delivery)
  end
end
