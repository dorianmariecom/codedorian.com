# frozen_string_literal: true

class Program < ApplicationRecord
  TIMEOUT = 60

  belongs_to :user, default: -> { Current.user }, touch: true

  has_many :executions, dependent: :destroy
  has_many :schedules, dependent: :destroy

  accepts_nested_attributes_for :schedules

  validate { can!(:update, user) }

  before_validation { log_in(self.user ||= User.create!) }

  def evaluate!
    Current.with(user:) do
      output = StringIO.new
      error = StringIO.new
      result = Code.evaluate(input, output:, error:, timeout: TIMEOUT)
      executions.create!(
        input:,
        result: result.to_s,
        output: output.string,
        error: error.string
      )
    rescue Code::Error, Timeout::Error => e
      execution =
        executions.create!(
          input:,
          result: nil,
          output: nil,
          error: "#{e.class}: #{e.message}"
        )

      EmailAddressMailer
        .with(
          from: "dorian@dorianmarie.com",
          to: "dorian@dorianmarie.com",
          subject: execution.error,
          text: "#{user}\n\n#{self}"
        )
        .code_mail
        .deliver_later

      execution
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

  def to_s
    input.presence || "program##{id}"
  end
end
