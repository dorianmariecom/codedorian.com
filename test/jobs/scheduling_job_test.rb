# frozen_string_literal: true

require "test_helper"

class SchedulingJobTest < ActiveJob::TestCase
  include ActiveJob::TestHelper

  setup do
    clear_enqueued_jobs
    clear_performed_jobs
  end

  test "recurring scheduling does not preload execution histories" do
    queries = []
    subscriber =
      ActiveSupport::Notifications.subscribe("sql.active_record") do |event|
        queries << event.payload[:sql]
      end

    SchedulingJob.perform_now

    assert_not(queries.any? { |query| query.include?('FROM "program_executions"') })
    assert_not(
      queries.any? do |query|
        query.include?('FROM "subscription_executions"')
      end
    )
  ensure
    ActiveSupport::Notifications.unsubscribe(subscriber) if subscriber
  end

  test "a program fetches one deterministic latest execution" do
    program = programs(:program)
    created_at = 1.day.from_now
    latest = nil

    Current.with(user: program.user) do
      program.program_executions.create!(status: :done, created_at: created_at)
      latest =
        program.program_executions.create!(
          status: :done,
          created_at: created_at
        )
    end

    query = program.reload.association(:program_execution).scope.to_sql

    assert_equal(latest, program.program_execution)
    assert_match(
      /ORDER BY .*created_at.* DESC, .*id.* DESC LIMIT 1/,
      query
    )
  end
end
