# frozen_string_literal: true

class Subscription < ApplicationRecord
  STATUSES = %w[active inactive].freeze
  belongs_to :user, default: -> { Current.user! }, touch: true
  belongs_to :plan, touch: true
  has_one :service, through: :plan
  has_many :plan_schedules, through: :plan
  has_many :subscription_executions, dependent: :destroy
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
  before_validation { self.user ||= Current.user! }
  validates :status, inclusion: { in: STATUSES }
  validates :plan_id, uniqueness: { scope: :user_id }
  validate { can!(:update, user) }

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

    execution.done! if execution.step_executions.none?
    execution
  end

  def enqueue_step_executions!(execution, scheduled_at:)
    return if execution.done? || execution.errored?

    execution
      .step_executions
      .includes(:step)
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
    service.steps.minimum(:offset_seconds) || 0
  end

  def execution_for(occurrence)
    subscription_executions
      .where(created_at: (occurrence + evaluation_offset_seconds.seconds)..)
      .order(created_at: :desc)
      .first
  end

  def scheduled_at
    offset = evaluation_offset_seconds.seconds
    plan_schedules
      .flat_map { |schedule| [schedule.previous_at, schedule.next_at] }
      .compact
      .uniq
      .select { |at| at + offset <= Time.zone.now }
      .max
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
  def to_s = service.to_s

  def to_code
    Code::Object::Subscription.new(
      id: id,
      created_at: created_at,
      plan_id: plan_id,
      status: status,
      updated_at: updated_at,
      user_id: user_id
    )
  end

  private

  def enqueue_step_execution!(execution, step_execution)
    step = step_execution.step
    perform_later(
      StepEvaluateJob,
      arguments: {
        step_execution: step_execution
      },
      priority: step.position,
      context: {
        user: user,
        subscription: self,
        subscription_execution: execution,
        step: step,
        step_execution: step_execution
      },
      current: {
        user: user,
        subscription: self,
        subscription_execution: execution,
        step_execution: step_execution,
        locale: user.locale,
        time_zone: user.unverified_time_zone
      }
    )
  end
end
