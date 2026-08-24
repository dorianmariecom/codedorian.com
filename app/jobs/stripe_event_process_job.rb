# frozen_string_literal: true

class StripeEventProcessJob < ApplicationJob
  queue_as :default

  def perform(stripe_event)
    StripeEventProcessor.new(stripe_event).call
  end
end
