# frozen_string_literal: true

require "test_helper"

class ApplicationJobTest < ActiveJob::TestCase
  class MissingRecordJob < ApplicationJob
    def perform
      raise ActiveRecord::RecordNotFound, "missing record"
    end
  end

  class DeserializeRecordJob < ApplicationJob
    def perform(_record)
      raise "deleted record should not reach perform"
    end
  end

  teardown { Current.reset }

  test "discarded missing records clean up context and record a log" do
    job = MissingRecordJob.new
    context = JobContext.create!(active_job_id: job.job_id)

    assert_difference -> { Log.where(message: "discard_on").count }, 1 do
      job.perform_now
    end

    assert_not JobContext.exists?(context.id)
  end

  test "discarded deserialization failures clean up context and record a log" do
    record = JobContext.create!(active_job_id: SecureRandom.uuid)
    job = DeserializeRecordJob.new(record)
    serialized = job.serialize
    context = JobContext.create!(active_job_id: job.job_id)
    record.delete

    assert_difference -> { Log.where(message: "discard_on").count }, 1 do
      ActiveJob::Base.execute(serialized)
    end

    assert_not JobContext.exists?(context.id)
  end
end
