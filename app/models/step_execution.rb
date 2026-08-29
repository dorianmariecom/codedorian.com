# frozen_string_literal: true

class StepExecution < ApplicationRecord
  TIMEOUT = Program::TIMEOUT
  STATUSES = SubscriptionExecution::STATUSES
  belongs_to :subscription_execution, touch: true
  belongs_to :step
  has_one :subscription, through: :subscription_execution
  has_one :plan, through: :subscription
  has_one :service, through: :plan
  has_one :user, through: :subscription
  validates :status, inclusion: { in: STATUSES }
  validate { can!(:update, subscription_execution) }
  validate :step_belongs_to_service

  def self.search_fields
    {
      status: {
        node: -> { arel_table[:status] },
        type: :string
      },
      input: {
        node: -> { arel_table[:input] },
        type: :string
      },
      output: {
        node: -> { arel_table[:output] },
        type: :string
      },
      result: {
        node: -> { arel_table[:result] },
        type: :string
      },
      **base_search_fields
    }
  end

  def done? = status == "done"
  def errored? = status == "errored"
  def generating? = status.in?(%w[initialized in_progress])

  def scheduled_job
    @scheduled_job ||=
      Job
        .where_step_execution(self)
        .where(finished_at: nil, class_name: "StepEvaluateJob")
        .first
  end

  def scheduled_job? = scheduled_job.present?

  def evaluate!
    update!(status: :in_progress)
    context = Code::Object::Context.new
    output_io = StringIO.new
    error_io = StringIO.new
    value =
      Code.evaluate(
        input,
        context: context,
        output: output_io,
        error: error_io,
        timeout: TIMEOUT
      )
    update!(
      output: output_io.string,
      error: error_io.string,
      result: value.inspect,
      status: :done
    )
  rescue Code::Error => e
    update!(
      status: :errored,
      error_class: e.class,
      error_message: e.message,
      error_backtrace: e.backtrace.join("\n")
    )
  ensure
    subscription_execution.finish! if persisted?
  end

  def translated_status = t("statuses.#{status}")
  def error_app_backtrace = Backtrace.app(error_backtrace)

  def to_s
    [step.to_s, translated_status].compact_blank.join(" - ").presence ||
      t("to_s", id: id)
  end

  def to_code
    Code::Object::StepExecution.new(
      id: id,
      created_at: created_at,
      error: error,
      error_backtrace: error_backtrace,
      error_class: error_class,
      error_message: error_message,
      input: input,
      output: output,
      result: result,
      status: status,
      step_id: step_id,
      subscription_execution_id: subscription_execution_id,
      updated_at: updated_at
    )
  end

  private

  def step_belongs_to_service
    return if step.blank? || subscription_execution.blank?
    return if step.service == subscription_execution.service

    errors.add(:step, :invalid)
  end
end
