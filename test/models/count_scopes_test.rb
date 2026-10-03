# frozen_string_literal: true

require "test_helper"

class CountScopesTest < ActiveSupport::TestCase
  setup { Current.user = users(:admin) }
  teardown { Current.reset }

  test "job scopes return one row per record with multiple matching contexts" do
    job = jobs(:job)
    program = programs(:program)
    2.times do
      JobContext.create!(
        active_job_id: job.active_job_id,
        context: {
          program: {
            id: program.id
          }
        }
      )
    end

    [
      Job,
      JobReadyExecution,
      JobFailedExecution,
      JobBlockedExecution,
      JobClaimedExecution,
      JobScheduledExecution,
      JobRecurringExecution,
      JobBatchExecution
    ].each do |model|
      records = model.where_program(program)

      assert_equal(1, records.count, model.name)
      assert_equal(1, records.to_a.length, model.name)
      assert_empty(model.where_program(programs(:other_program)), model.name)
    end
  end

  test "error scopes return one row per error with multiple matching occurrences" do
    error = errors(:error)
    program = programs(:program)
    2.times do
      ErrorOccurrence.create!(
        error: error,
        context: {
          program: {
            id: program.id
          }
        }
      )
    end

    records = Error.where_program(program)

    assert_equal(1, records.count)
    assert_equal([error.id], records.pluck(:id))
    assert_empty(Error.where_program(programs(:other_program)))
  end
end
