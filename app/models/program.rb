# frozen_string_literal: true

class Program < ApplicationRecord
  TIMEOUT = 1.hour

  belongs_to(:user, default: -> { Current.user! }, touch: true)

  has_many(:program_executions, dependent: :destroy)
  has_many(:program_schedules, dependent: :destroy)
  has_many(:program_prompts, dependent: :destroy)
  has_many(:program_schedule_prompts, through: :program_prompts)

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

  def evaluate!
    Current.with(user: user) do
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
    rescue Code::Error => e # TODO: code-ruby should tranform timeouts into code::error
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
      ProgramEvaluateAndScheduleJob.set(wait_until: next_at).perform_later(
        program: self
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
    input.to_s.truncate(SAMPLE_SIZE, omission: OMISSION).presence # TODO make Truncate class
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
    name.presence || input_sample.presence || t("to_s", id: id)
  end
end
