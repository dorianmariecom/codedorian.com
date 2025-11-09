# frozen_string_literal: true

class Program < ApplicationRecord
  TIMEOUT = 1.hour

  belongs_to(:user, default: -> { Current.user! }, touch: true)

  scope(:where_user, ->(user) { where(user: user) })

  has_many(:program_executions, dependent: :destroy)
  has_one(
    :program_execution,
    -> { order(created_at: :desc) },
    dependent: :destroy
  )
  has_many(:program_schedules, dependent: :destroy)
  has_many(:program_prompts, dependent: :destroy)
  has_many(:program_schedule_prompts, through: :program_prompts)
  has_many(:messages, dependent: :nullify)

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
      **base_search_fields,
      **User.associated_search_fields
    }
  end

  def self.schedule_all
    ApplicationRecord.transaction { find_each(&:schedule!) }
  end

  def self.reschedule_all
    ApplicationRecord.transaction { find_each(&:reschedule!) }
  end

  def self.unschedule_all
    ApplicationRecord.transaction { find_each(&:unschedule!) }
  end

  def evaluate!
    Current.with(user: user, program: self) do
      program_execution = program_executions.create!(status: :in_progress)
      context = Code::Object::Context.new
      output = StringIO.new
      error = StringIO.new
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
  end

  def scheduled_now?
    return false if unscheduled?
    return false if program_schedules.none?
    return false if scheduled_job?
    return false if program_execution&.generating?
    return false if starts_at > now

    !program_execution || program_execution.created_at < previous_at
  end

  def unscheduled?
    !scheduled?
  end

  def now
    Time.zone.now
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
    Job.where_program(self).where(class_name: "ProgramEvaluateJob").first
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

  def to_code
    Code::Object::Program.new(
      id: id,
      name: name,
      input: input,
      updated_at: updated_at,
      created_at: created_at,
      schedules: program_schedules
    )
  end

  def to_s
    name_sample.presence || input_sample.presence || t("to_s", id: id)
  end
end
