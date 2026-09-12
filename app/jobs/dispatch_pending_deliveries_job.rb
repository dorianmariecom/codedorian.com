# frozen_string_literal: true

class DispatchPendingDeliveriesJob < ApplicationJob
  def perform
    Delivery.due.find_each(&:enqueue)
    Delivery
      .where(status: "sending")
      .where(updated_at: ...15.minutes.ago)
      .find_each do |delivery|
        delivery.with_lock do
          if delivery.status == "sending" &&
               delivery.updated_at < 15.minutes.ago
            delivery.update!(
              status: "uncertain",
              error_code: "worker_interrupted"
            )
          end
        end
      end
  end
end
