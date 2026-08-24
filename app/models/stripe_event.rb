# frozen_string_literal: true

class StripeEvent < ApplicationRecord
  STATUSES = %w[pending enqueued processing processed failed].freeze

  validates :stripe_event_id, presence: true, uniqueness: true
  validates :event_type, presence: true
  validates :status, inclusion: { in: STATUSES }

  def processed!
    update!(
      status: "processed",
      processed_at: Time.current,
      processing_error: nil
    )
  end

  def failed!(error)
    update!(
      status: "failed",
      processing_error: "#{error.class}: #{error.message}"
    )
  end
end
