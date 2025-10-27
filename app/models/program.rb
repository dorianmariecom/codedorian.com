# frozen_string_literal: true

class Program < ApplicationRecord
  TIMEOUT = 1.hour

  belongs_to(:user, default: -> { Current.user! }, touch: true)

  scope(:where_user, ->(user) { where(user: user) })

  has_many(:program_executions, dependent: :destroy)
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

  def next_at
    program_schedules.map(&:next_at).select(&:future?).min
  end

  def next_at?
    next_at.present?
  end

  def scheduled?
    scheduled_jobs.any?
  end

  def scheduled_at
    scheduled_jobs.first&.scheduled_at
  end

  def scheduled_at?
    scheduled_at.present?
  end

  def unschedule!
    SolidQueue::ScheduledExecution.discard_all_from_jobs(scheduled_jobs)
    scheduled_jobs.destroy_all
    touch
  end

  def reschedule!
    unschedule!
    if next_at
      perform_later(
        ProgramEvaluateAndScheduleJob,
        wait_until: next_at,
        arguments: {
          program: self
        },
        context: {
          current_user: Current.user,
          user: user,
          program: self
        }
      )
    end
    touch
  end

  alias schedule! reschedule!

  def scheduled_jobs
    SolidQueue::Job.where(
      <<~SQL.squish,
          class_name = :class_name
          AND
          (
            ((
              ((
                ((arguments::jsonb)->>'arguments')::jsonb
              )->0)::jsonb
            )->>'program')::jsonb
          )->>'_aj_globalid' = :global_id
      SQL
      class_name: "ProgramEvaluateAndScheduleJob",
      global_id: to_global_id.to_s
    )
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
