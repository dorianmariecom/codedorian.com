# frozen_string_literal: true

class Subscription < ApplicationRecord
  has_many :subscription_destinations, dependent: :destroy
  has_many :delivery_destinations,
           -> { where(subscription_destinations: { selected: true }) },
           through: :subscription_destinations
  accepts_nested_attributes_for :delivery_destinations, allow_destroy: true
  has_many :deliveries, dependent: :destroy

  attr_accessor :delivery_preview, :delivery_confirmation

  before_validation :assign_delivery_users

  def deliver!(**attributes)
    ProgramDelivery.call(subscription: self, **attributes)
  end

  STATUSES = %w[active inactive].freeze
  belongs_to :user, default: -> { Current.user! }, touch: true
  belongs_to :plan, touch: true
  has_one :service, through: :plan
  has_many :plan_schedules, through: :plan
  has_many :subscription_executions, dependent: :destroy
  has_many :stripe_invoices, dependent: :nullify
  has_many :subscription_values,
           -> { order(:id) },
           dependent: :destroy,
           inverse_of: :subscription
  accepts_nested_attributes_for :subscription_values, allow_destroy: true
  has_one :subscription_execution,
          -> { order(created_at: :desc) },
          dependent: :destroy,
          inverse_of: :subscription
  scope :where_user, ->(user) { where(user: user) }
  scope :where_plan, ->(plan) { where(plan: plan) }
  scope :where_service,
        ->(service) { joins(:plan).where(plans: { service_id: service }) }
  before_validation { self.user ||= Current.user! }
  validates :status, inclusion: { in: STATUSES }
  validates :amount_cents,
            numericality: {
              only_integer: true,
              greater_than: 0
            },
            allow_nil: true
  validates :amount_currency, format: { with: /\A[a-z]{3}\z/ }, allow_nil: true
  validate do
    if persisted? && will_save_change_to_user_id? &&
         subscription_destinations.exists?
      errors.add(:user, :invalid)
    end
    if persisted? && billed? && will_save_change_to_plan_id? &&
         delivery_pricing.present?
      errors.add(:plan, :invalid)
    end
  end
  validate :required_values_present
  validate :valid_delivery_destinations
  validate { can!(:update, user) }

  def prepare_delivery_destinations
    return unless plan && delivery_destinations.empty?

    delivery_destinations.build(user: user)
  end

  def delivery_pricing
    return {} if delivery_amount_cents.nil?

    {
      "base_amount_cents" => delivery_base_amount_cents,
      "amount_cents" => delivery_amount_cents,
      "amount_currency" => delivery_amount_currency,
      "items" =>
        subscription_destinations
          .preload(delivery_destination: :delivery_channel)
          .selected
          .order(:delivery_destination_id)
          .map do |selection|
            {
              "destination_id" => selection.delivery_destination_id,
              "name" => selection.delivery_destination.to_s,
              "amount_cents" => selection.amount_cents
            }
          end
    }
  end

  def confirm_delivery_changes?(attributes, confirmation)
    return true unless attributes.key?(:delivery_destinations_attributes)

    self.delivery_preview = SubscriptionDeliveryBilling.preview(self)
    confirmation_attributes = attributes.to_h.deep_stringify_keys
    %w[
      delivery_destinations_attributes
      subscription_values_attributes
    ].each do |key|
      nested_attributes = confirmation_attributes[key]
      if nested_attributes.is_a?(Hash)
        confirmation_attributes[key] = nested_attributes.values
      end
    end
    expected = {
      "subscription_id" => id,
      "attributes" => confirmation_attributes,
      "quote" => delivery_preview
    }
    verifier = Rails.application.message_verifier(:delivery_price)
    if verifier.verified(confirmation.to_s, purpose: :delivery_price) ==
         expected
      return true
    end

    self.delivery_confirmation =
      verifier.generate(
        expected,
        purpose: :delivery_price,
        expires_in: 15.minutes
      )
    false
  end

  def save_with_delivery_destinations
    creating = new_record?
    changing_destinations =
      delivery_destinations.any? do |destination|
        destination.new_record? || destination.changed? ||
          destination.marked_for_destruction?
      end
    destinations = delivery_destinations.reject(&:marked_for_destruction?)
    saved =
      self.class.transaction do
        raise ActiveRecord::Rollback unless save(context: :controller)

        if creating || changing_destinations || delivery_preview
          quote = delivery_preview&.deep_dup
          destinations.each_with_index do |destination, index|
            quote
              &.fetch("items")
              &.each do |item|
                item["destination_id"] = destination.id if item[
                  "destination_id"
                ] == "new_#{index}"
              end
          end
          SubscriptionDeliveryBilling.select!(
            self,
            destinations.map(&:id),
            sync: false,
            expected_quote: quote
          )
        end
        true
      end
    if saved && (creating || changing_destinations || delivery_preview) &&
         delivery_change_key.present?
      SubscriptionDeliveryBilling.sync!(self)
    end
    saved
  rescue StripeBilling::PricingError, Stripe::StripeError => e
    errors.add(:base, e.message)
    false
  end

  def self.search_fields
    {
      status: {
        node: -> { arel_table[:status] },
        type: :string
      },
      **base_search_fields,
      **User.associated_search_fields
    }
  end

  def activate! = update!(status: :active)
  def active? = status == "active"
  def deactivate! = update!(status: :inactive)
  def billed? = stripe_subscription_id.present?
  def canceling? = cancel_at_period_end?

  def ensure_checkout_snapshot!
    with_lock do
      if stripe_checkout_idempotency_key.blank?
        price = SubscriptionDeliveryBilling.price_for(self)
        update!(**price, stripe_checkout_idempotency_key: SecureRandom.uuid)
      end
      stripe_checkout_idempotency_key
    end
  end

  def reset_checkout!
    update!(
      stripe_checkout_session_id: nil,
      stripe_checkout_idempotency_key: nil
    )
  end

  def billing_active!
    update!(status: "active")
    return unless delivery_change_key.blank?

    subscription_destinations.selected.find_each(&:active!)
  end

  def billing_inactive!
    update!(status: "inactive")
  end

  def duration = plan_schedules.filter_map(&:duration).min || 0.seconds
  def duration_in_seconds = duration.to_i

  def evaluate!(execution:)
    execution
      .step_executions
      .joins(:step)
      .order("steps.position")
      .each do |step_execution|
        if block_given?
          yield(step_execution)
        else
          step_execution.evaluate!
        end

        if step_execution.errored?
          execution.errored!
          break
        end
      end

    execution.reload
  end

  def evaluate_due_steps!
    return unless active?
    return if plan_schedules.none?

    occurrence = scheduled_at
    return if occurrence.blank?

    execution = execution_for(occurrence) || create_execution!
    enqueue_step_executions!(execution, scheduled_at: occurrence)
    execution
  end

  def create_execution!
    execution = subscription_executions.create!(status: :in_progress)

    Current.with(user: service.user, subscription_execution: execution) do
      service
        .steps
        .order(:position)
        .each do |step|
          execution.step_executions.create!(
            step: step,
            input: step.input,
            status: :initialized
          )
        end
    end

    execution.done! if execution.step_executions.none?
    execution
  end

  def enqueue_step_executions!(execution, scheduled_at:)
    return if execution.done? || execution.errored?

    execution
      .step_executions
      .preload(:step)
      .joins(:step)
      .order("steps.position")
      .each do |step_execution|
        if step_execution.errored?
          execution.errored!
          break
        end

        next if step_execution.done?
        if step_execution.status == "in_progress" ||
             step_execution.scheduled_job?
          break
        end
        if scheduled_at + step_execution.step.offset_seconds.seconds >
             Time.zone.now
          break
        end

        enqueue_step_execution!(execution, step_execution)
        break
      end
  end

  def evaluation_at
    scheduled_at&.+(evaluation_offset_seconds.seconds)
  end

  def evaluation_offset_seconds
    service.steps.order(:position).pick(:offset_seconds) || 0
  end

  def execution_for(occurrence)
    subscription_executions
      .where(created_at: (occurrence + evaluation_offset_seconds.seconds)..)
      .order(created_at: :desc)
      .first
  end

  def scheduled_at
    offset = evaluation_offset_seconds.seconds
    (
      [initial_scheduled_at] +
        plan_schedules.flat_map do |schedule|
          [schedule.previous_at, schedule.next_at]
        end
    ).compact.uniq.select { |at| at + offset <= Time.zone.now }.max
  end

  def inactive? = status == "inactive"
  def values = subscription_values.index_by(&:key)

  def prefill_for(field)
    case field.kind
    when "email_address"
      user.email_address
    when "phone_number"
      user.phone_number
    end
  end

  def prepare_values
    return unless plan

    existing = subscription_values.index_by(&:key)
    plan.fields.each do |field|
      next if existing.key?(field.key)

      subscription_values.build(
        key: field.key,
        value: new_record? ? prefill_for(field) : nil
      )
    end
  end

  def starts_at = plan_schedules.map(&:starts_at).min
  def previous_at = plan_schedules.map(&:previous_at).select(&:past?).max
  def next_at = plan_schedules.map(&:next_at).select(&:future?).min
  def translated_status = t("statuses.#{status}")

  def plan_sample
    Truncate.strip(plan)
  end

  def service_sample
    Truncate.strip(service)
  end

  def to_s
    Utils.join(service_sample, plan_sample, id_sample).presence ||
      t("to_s", id:)
  end

  def to_code
    Code::Object::Subscription.new(
      delivery_pricing: delivery_pricing,
      delivery_amount_cents: delivery_amount_cents,
      delivery_amount_currency: delivery_amount_currency,
      delivery_base_amount_cents: delivery_base_amount_cents,
      delivery_change_key: delivery_change_key,
      amount_cents: amount_cents,
      amount_currency: amount_currency,
      cancel_at_period_end: cancel_at_period_end,
      id: id,
      created_at: created_at,
      current_period_end: current_period_end,
      current_period_start: current_period_start,
      plan_id: plan_id,
      status: status,
      stripe_checkout_idempotency_key: stripe_checkout_idempotency_key,
      stripe_checkout_session_id: stripe_checkout_session_id,
      stripe_status: stripe_status,
      stripe_subscription_id: stripe_subscription_id,
      updated_at: updated_at,
      user_id: user_id
    )
  end

  private

  def assign_delivery_users
    self.user ||= Current.user!
    delivery_destinations.each do |destination|
      destination.user = user if destination.new_record?
    end
  end

  def valid_delivery_destinations
    delivery_destinations
      .reject(&:marked_for_destruction?)
      .each do |destination|
        unless new_record? || destination.new_record? || destination.changed?
          next
        end

        unless destination.user == user && destination.valid? &&
                 destination.available?
          errors.add(:base, I18n.t("delivery.invalid_destinations"))
        end
      end
  end

  def required_values_present
    return unless plan

    values =
      subscription_values.reject(&:marked_for_destruction?).index_by(&:key)

    plan
      .fields
      .select(&:required?)
      .each do |field|
        next if values[field.key]&.value.to_s.strip.present?

        name = field.name&.to_plain_text.presence || field.key
        errors.add(:base, :required_value_missing, field: name)
      end
  end

  def initial_scheduled_at
    first_plan_at = plan_schedules.minimum(:starts_at)
    return if first_plan_at.present? && created_at < first_plan_at

    created_at
  end

  def enqueue_step_execution!(execution, step_execution)
    step = step_execution.step
    execution_user = service.user
    perform_later(
      StepEvaluateJob,
      arguments: {
        step_execution: step_execution
      },
      priority: step.position,
      context: {
        user: execution_user,
        subscription: self,
        subscription_execution: execution,
        step: step,
        step_execution: step_execution
      },
      current: {
        user: execution_user,
        subscription: self,
        subscription_execution: execution,
        step_execution: step_execution,
        locale: execution_user.locale,
        time_zone: execution_user.unverified_time_zone
      }
    )
  end
end
