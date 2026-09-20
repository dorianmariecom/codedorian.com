# frozen_string_literal: true

class Delivery < ApplicationRecord
  STATUSES = %i[
    pending
    sending
    accepted
    delivered
    failed
    uncertain
    canceled
  ].freeze
  MAX_ATTEMPTS = 5
  WORKER_TIMEOUT = 15.minutes

  belongs_to :connection, class_name: "DeliveryConnection", optional: true
  belongs_to :subscription
  has_one :service, through: :subscription
  belongs_to :delivery_destination
  belongs_to :step_execution, optional: true
  validates :event_key, presence: true
  validates :status, inclusion: { in: STATUSES.map(&:to_s) }
  validates :event_key_digest,
            uniqueness: {
              scope: %i[subscription_id delivery_destination_id]
            }
  scope :where_subscription,
        ->(subscription) { where(subscription: subscription) }
  scope :pending, -> { where(status: :pending) }
  scope :sending, -> { where(status: :sending) }
  scope :late, -> { where(updated_at: ...WORKER_TIMEOUT.ago) }
  scope :due,
        -> do
          pending.where(next_attempt_at: nil).or(
            pending.where(next_attempt_at: ..Time.current)
          )
        end

  before_validation :copy_destination, on: :create
  before_validation do
    if will_save_change_to_event_key? || event_key_digest.blank?
      self.event_key_digest = Digest::SHA256.hexdigest(event_key.to_s)
    end
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

  def pending? = status == "pending"
  def sending? = status == "sending"
  def accepted? = status == "accepted"
  def delivered? = status == "delivered"
  def canceled? = status == "canceled"
  def visibility_public? = visibility == "public"
  def visibility_private? = visibility == "private"
  def future? = next_attempt_at&.future?
  def available? = delivery_destination.available?

  def failed? = status == "failed"
  def uncertain? = status == "uncertain"
  def completed? = status.in?(%w[delivered failed canceled])

  def connection_for_twilio!
    DeliveryConnection.twilio.where_user(User.admin).find(connection_id)
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

  def self.search_fields
    {
      subscription_id: {
        node: -> { arel_table[:subscription_id] },
        type: :integer
      },
      delivery_destination_id: {
        node: -> { arel_table[:delivery_destination_id] },
        type: :integer
      },
      step_execution_id: {
        node: -> { arel_table[:step_execution_id] },
        type: :integer
      },
      connection_id: {
        node: -> { arel_table[:connection_id] },
        type: :integer
      },
      event_key: {
        node: -> { arel_table[:event_key] },
        type: :string
      },
      subject: {
        node: -> { arel_table[:subject] },
        type: :string
      },
      body_text: {
        node: -> { arel_table[:body_text] },
        type: :string
      },
      body_html: {
        node: -> { arel_table[:body_html] },
        type: :string
      },
      url: {
        node: -> { arel_table[:url] },
        type: :string
      },
      locale: {
        node: -> { arel_table[:locale] },
        type: :string
      },
      channel: {
        node: -> { arel_table[:channel] },
        type: :string
      },
      recipient: {
        node: -> { arel_table[:recipient] },
        type: :string
      },
      visibility: {
        node: -> { arel_table[:visibility] },
        type: :string
      },
      status: {
        node: -> { arel_table[:status] },
        type: :string
      },
      provider_id: {
        node: -> { arel_table[:provider_id] },
        type: :string
      },
      error_code: {
        node: -> { arel_table[:error_code] },
        type: :string
      },
      attempts: {
        node: -> { arel_table[:attempts] },
        type: :integer
      },
      next_attempt_at: {
        node: -> { arel_table[:next_attempt_at] },
        type: :datetime
      },
      **base_search_fields
    }
  end

  def translated_status = t("statuses.#{status}")

  def to_s = Utils.join(delivery_destination, translated_status, id_sample)

  def public_token
    key = Config.delivery.public_token_secret
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
          status:
            outcome.to_s.to_sym.presence_in(%i[accepted delivered]) || :failed,
          error_code: "manually_reconciled"
        )
      end
    end
  end

  def subscription_destination
    subscription.subscription_destinations.find_by(
      delivery_destination: delivery_destination
    )
  end

  def selected?
    selection = subscription_destination
    subscription.active? && selection&.active? && selection.selected?
  end

  def claim!
    with_lock do
      return false unless pending? && !future?

      unless selected?
        canceled!
        return false
      end
      unless recipient_verified_for_delivery?
        recipient_unverified!
        return false
      end
      unless available?
        destination_unavailable!
        return false
      end

      sending!
      true
    end
  end

  def recipient_verified_for_delivery?
    return true unless channel.in?(%w[email reddit])

    destination = delivery_destination.reload
    destination.channel == channel && destination.recipient_verified? &&
      destination.user_id == subscription.user_id &&
      destination.recipient.to_s.strip.downcase == recipient.to_s.strip.downcase
  end

  def recipient_unverified!
    update!(
      status: :canceled,
      error_code: :recipient_unverified,
      next_attempt_at: nil
    )
  end

  def canceled! = update!(status: :canceled)
  def sending! = update!(status: :sending, attempts: attempts + 1)

  def destination_unavailable!
    update!(status: :failed, error_code: :destination_unavailable)
  end

  def failed!(error:) = update!(status: :failed, error_code: error.code)

  def uncertain!(error:)
    update!(status: :uncertain, error_code: error.class.name)
  end

  def pending!(error:)
    update!(
      status: :pending,
      error_code: error.code,
      next_attempt_at: Time.current + (2**attempts).minutes
    )
  end

  def receive_result!(result)
    with_lock do
      if sending?
        update!(
          status: result.status,
          provider_id: result.provider_id,
          error_code: nil
        )
      end
    end
  end

  def reject!(error:)
    with_lock do
      return unless sending?

      if error.retryable && attempts < MAX_ATTEMPTS
        pending!(error: error)
      else
        failed!(error: error)
      end
    end
  end

  def worker_interrupted!
    with_lock do
      if sending? && updated_at < WORKER_TIMEOUT.ago
        update!(status: :uncertain, error_code: :worker_interrupted)
      end
    end
  end

  def to_code
    Code::Object::Delivery.new(attributes)
  end

  private

  def copy_destination
    return unless delivery_destination

    self.channel ||= delivery_destination.channel
    self.recipient ||= delivery_destination.recipient
    self.visibility ||= delivery_destination.visibility
    self.connection ||= delivery_destination.connection
    self.locale ||= subscription&.user&.locale.to_s.presence || "en"
  end
end
