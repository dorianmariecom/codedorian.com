# frozen_string_literal: true

class Program < ApplicationRecord
  TIMEOUT = 1.hour

  belongs_to(:user, default: -> { Current.user! }, touch: true)

  scope(:where_user, ->(user) { where(user: user) })
  scope(:scheduled, -> { where(scheduled: true) })
  scope(:not_scheduled, -> { where(scheduled: false) })
  scope(:unscheduled, -> { not_scheduled })

  has_many(:program_executions, dependent: :destroy)
  has_one(
    :program_execution,
    -> { order(created_at: :desc) },
    dependent: :destroy,
    inverse_of: :program
  )
  has_many(:program_schedules, dependent: :destroy)
  accepts_nested_attributes_for(:program_schedules, allow_destroy: true)

  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }

  def self.search_fields
    {
      name: {
        node: -> { arel_table[:name] },
        type: :string
      },
      input: {
        node: -> { arel_table[:input] },
        type: :string
      },
      scheduled: {
        node: -> { arel_table[:scheduled] },
        type: :boolean
      },
      **base_search_fields,
      **User.associated_search_fields
    }
  end

  def self.schedule_all
    ApplicationRecord.transaction { find_each(&:schedule!) }
  end

  def self.unschedule_all
    ApplicationRecord.transaction { find_each(&:unschedule!) }
  end

  def self.format_all
    ApplicationRecord.transaction { find_each(&:format!) }
  end

  def evaluate!(program_execution:)
    program_execution.update!(
      input: input,
      output: nil,
      error: nil,
      result: nil,
      error_class: nil,
      error_message: nil,
      error_backtrace: nil,
      status: :in_progress
    )
    context = Code::Object::Context.new
    output = program_execution.stream_io(:output)
    error = program_execution.stream_io(:error)
    result =
      Code.evaluate(
        input,
        context: context,
        output: output,
        error: error,
        timeout: TIMEOUT
      )
    program_execution.update!(
      input: input,
      result: result.inspect,
      output: output.string,
      error: error.string,
      status: :done
    )
  rescue Code::Error => e
    program_execution.update!(
      input: input,
      status: :errored,
      error_class: e.class,
      error_message: e.message,
      error_backtrace: e.backtrace.join("\n")
    )
  end

  def format!
    update!(input: Code.format(input))
  end

  def scheduled_now?
    return false if unscheduled?
    return false if program_schedules.none?
    return false if scheduled_job?
    return false if program_execution&.generating?
    return false if starts_at > now
    return false unless previous_at?

    !program_execution || program_execution.created_at <= previous_at
  end

  def unscheduled?
    !scheduled?
  end

  def now
    Time.zone.now
  end

  def duration
    program_schedules.filter_map(&:duration).min || 0.seconds
  end

  def duration_in_seconds
    duration.to_i
  end

  def starts_at
    program_schedules.map(&:starts_at).min
  end

  def previous_at
    program_schedules.map(&:previous_at).select(&:past?).max
  end

  def next_at
    program_schedules.map(&:next_at).select(&:future?).min
  end

  def previous_at?
    previous_at.present?
  end

  def next_at?
    next_at.present?
  end

  def unschedule!
    update!(scheduled: false)
  end

  def schedule!
    update!(scheduled: true)
  end

  def scheduled_job
    @scheduled_job ||=
      Job
        .where_program(self)
        .where(finished_at: nil, class_name: "ProgramEvaluateJob")
        .first
  end

  def scheduled_job?
    !!scheduled_job
  end

  def input_sample
    Truncate.strip(input)
  end

  def name_sample
    Truncate.strip(name)
  end

  def user_sample
    Truncate.strip(user)
  end

  def to_code
    Code::Object::Program.new(
      id: id,
      created_at: created_at,
      input: input,
      name: name,
      scheduled: scheduled,
      updated_at: updated_at,
      user_id: user_id
    )
  end

  def schedules = program_schedules

  def to_s
    Utils.join(
      name_sample.presence || input_sample.presence || user_sample,
      id_sample
    ).presence ||
      t("to_s", id:)
  end
end
