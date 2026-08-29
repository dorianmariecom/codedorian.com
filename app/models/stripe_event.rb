# frozen_string_literal: true

class StripeEvent < ApplicationRecord
  STATUSES = %w[pending enqueued processing processed failed].freeze

  validates :stripe_event_id, presence: true, uniqueness: true
  validates :event_type, presence: true
  validates :status, inclusion: { in: STATUSES }
  validate :parse_and_validate_payload, on: :controller

  def self.search_fields
    {
      stripe_event_id: {
        node: -> { arel_table[:stripe_event_id] },
        type: :string
      },
      event_type: {
        node: -> { arel_table[:event_type] },
        type: :string
      },
      status: {
        node: -> { arel_table[:status] },
        type: :string
      },
      livemode: {
        node: -> { arel_table[:livemode] },
        type: :boolean
      },
      stripe_created_at: {
        node: -> { arel_table[:stripe_created_at] },
        type: :datetime
      },
      processed_at: {
        node: -> { arel_table[:processed_at] },
        type: :datetime
      },
      processing_error: {
        node: -> { arel_table[:processing_error] },
        type: :string
      },
      payload: {
        node: -> { arel_table[:payload] },
        type: :string
      },
      **base_search_fields
    }
  end

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

  def payload_json
    JSON.pretty_generate(payload)
  end

  def stripe_event_id_sample
    Truncate.strip(stripe_event_id)
  end

  def to_s
    Utils.join(stripe_event_id_sample, id_sample).presence || t("to_s", id:)
  end

  private

  def parse_and_validate_payload
    self.payload = JSON.parse(payload.to_s)
  rescue JSON::ParserError
    errors.add(:payload, t("invalid_json"))
  end
end
