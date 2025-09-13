# frozen_string_literal: true

class Program < ApplicationRecord
  TIMEOUT = 600
  INPUT_SAMPLE_SIZE = 140
  OMISSION = "…"

  belongs_to :user, default: -> { Current.user! }, touch: true

  has_many :executions, dependent: :destroy
  has_many :schedules, as: :schedulable, dependent: :destroy

  accepts_nested_attributes_for :schedules, allow_destroy: true

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

  def evaluate!(params: {})
    Current.with(user: user) do
      context = Code::Object::Context.new({ parameters: params })
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
      executions.create!(
        input: input,
        result: result.inspect,
        output: output.string,
        error: error.string
      )
    rescue Code::Error, Timeout::Error => e
      executions.create!(
        input: input,
        result: nil,
        output: nil,
        error: "#{e.class}: #{e.message}"
      )
    end
  end

  def next_at
    schedules.map(&:next_at).select(&:future?).min
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
  end

  def schedule!
    unschedule!
    return unless next_at

    EvaluateAndScheduleJob.set(wait_until: next_at).perform_later(program: self)
  end

  def scheduled_jobs
    SolidQueue::Job.where(
      <<~SQL.squish,
          class_name = :class_name
          AND
          (
            (
              (
                (
                  (
                    (
                      (
                        arguments::jsonb
                      )->>'arguments'
                    )::jsonb
                  )->0
                )::jsonb
              )->>'program'
            )::jsonb
          )->>'_aj_globalid' = :global_id
      SQL
      class_name: "EvaluateAndScheduleJob",
      global_id: to_global_id.to_s
    )
  end

  def input_sample
    input.to_s.truncate(INPUT_SAMPLE_SIZE, omission: OMISSION).presence
  end

  def as_json(...)
    { id: id, name: name, input: input, schedules: schedules }.as_json(...)
  end

  def to_code
    Code::Object::Program.new(
      id: id,
      name: name,
      input: input,
      schedules: schedules
    )
  end

  def to_s
    name.presence || input_sample.presence || t("to_s", id: id)
  end
end
