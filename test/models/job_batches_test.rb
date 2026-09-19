# frozen_string_literal: true

require "test_helper"

class JobBatchesTest < ActiveSupport::TestCase
  setup { Current.user = users(:admin) }
  teardown { Current.reset }

  test "the installed schema supports batch tracking and completion" do
    assert SolidQueue::Batch.migrated?
    batch = job_batches(:job_batch)
    job = jobs(:job)
    assert_equal batch.id,
                 Code.evaluate("Job.find!(#{job.id}).batch.id").as_json
    assert_equal batch.id,
                 Code.evaluate(
                   "Job.find!(#{job.id}).batch_execution.batch.id"
                 ).as_json
    assert_equal job.id,
                 Code.evaluate(
                   "JobBatch.find!(#{batch.id}).jobs.first.id"
                 ).as_json
    assert_equal job.id,
                 Code.evaluate(
                   "JobBatch.find!(#{batch.id}).batch_executions.first.job.id"
                 ).as_json
    batch.update!(enqueued_at: Time.current, total_jobs: 1)
    job_batch_executions(:job_batch_execution).destroy!
    batch.finish
    assert batch.reload.finished?
  end

  test "batch records and runtime queries require an admin" do
    [users(:other_user), nil].each do |user|
      Current.user = user
      assert_empty Code.evaluate("JobBatch.all").as_json
      assert_empty Code.evaluate("JobBatchExecution.all").as_json
      assert_raises(Pundit::NotAuthorizedError) do
        JobBatch.create!(description: "forbidden")
      end
    end
  end
end
