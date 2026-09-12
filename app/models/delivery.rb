# frozen_string_literal: true

class Delivery < ApplicationRecord
  STATUSES = %w[
    pending
    sending
    accepted
    delivered
    failed
    uncertain
    canceled
  ].freeze
  belongs_to :subscription
  belongs_to :delivery_destination
  belongs_to :step_execution, optional: true
  validates :event_key, presence: true, length: { maximum: 255 }
  validates :status, inclusion: { in: STATUSES }
  validates :event_key,
            uniqueness: {
              scope: %i[subscription_id delivery_destination_id]
            }
  scope :due,
        -> do
          where(status: "pending").where(
            "next_attempt_at IS NULL OR next_attempt_at <= ?",
            Time.current
          )
        end
  before_validation do
    self.destination_snapshot = delivery_destination.snapshot if new_record? &&
      destination_snapshot.blank? && delivery_destination
  end
  validate do
    if subscription && delivery_destination &&
         subscription.user_id != delivery_destination.user_id
      errors.add(:delivery_destination, :invalid)
    end
    if step_execution &&
         step_execution.subscription_execution.subscription_id !=
           subscription_id
      errors.add(:step_execution, :invalid)
    end
  end
  after_create_commit :enqueue

  def pending? = status == "pending"
  def failed? = status == "failed"
  def uncertain? = status == "uncertain"
  def completed? = status.in?(%w[delivered failed canceled])

  def connection_for_twilio!
    DeliveryConnection
      .twilio
      .where_user(User.admin)
      .find(destination_snapshot.fetch("connection_id"))
  end

  def receive_twilio_callback!(data)
    with_lock do
      if data["MessageSid"].blank? ||
           (provider_id.present? && provider_id != data["MessageSid"])
        next :unprocessable_content
      end
      # Acceptance is provisional; a later receipt can confirm delivery or failure.
      next :ok if completed?

      received_status =
        case data["MessageStatus"]
        when "delivered", "read"
          "delivered"
        when "failed", "undelivered"
          "failed"
        else
          "accepted"
        end
      update!(
        status: received_status,
        provider_id: data["MessageSid"],
        error_code: data["ErrorCode"]
      )
      :ok
    end
  end

  def user = subscription.user
  def self.search_fields = base_search_fields
  def to_s = "#{delivery_destination}: #{I18n.t("delivery.statuses.#{status}")}"

  def public_token
    key = Rails.application.key_generator.generate_key("public-delivery-v1", 32)
    "#{id}-#{OpenSSL::HMAC.hexdigest("SHA256", key, id.to_s)}"
  end

  def self.find_public(token)
    id, = token.to_s.split("-", 2)
    return unless id.to_s.match?(/\A[0-9]+\z/)

    delivery = find_by(id: id)
    if delivery &&
         ActiveSupport::SecurityUtils.secure_compare(
           delivery.public_token,
           token.to_s
         )
      delivery
    end
  end

  def enqueue
    DeliveryJob.perform_later(delivery_id: id)
  end

  def reset!
    with_lock do
      if failed?
        update!(
          status: "pending",
          error_code: nil,
          attempts: 0,
          next_attempt_at: nil
        )
      end
      enqueue if pending?
    end
  end

  def reconcile!(outcome)
    with_lock do
      if uncertain?
        update!(
          status: outcome.presence_in(%w[accepted delivered]) || "failed",
          error_code: "manually_reconciled"
        )
      end
    end
  end
end
