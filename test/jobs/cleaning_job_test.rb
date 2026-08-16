# frozen_string_literal: true

require "test_helper"

class CleaningJobTest < ActiveJob::TestCase
  test "deletes retained records older than one month" do
    travel_to(Time.zone.local(2026, 8, 16, 12)) do
      old_records = retention_records(created_at: 1.month.ago - 1.second)
      current_records = retention_records(created_at: 1.month.ago)
      Guest.update_all(created_at: Time.current)

      CleaningJob.perform_now

      old_records.each { |record| assert_not(record.class.exists?(record.id)) }
      current_records.each { |record| assert(record.class.exists?(record.id)) }
    end
  end

  test "caps deletion for each model" do
    assert_equal(1_000, CleaningJob::BATCH_SIZE)
  end

  private

  def retention_records(created_at:)
    [
      Version.create!(
        created_at: created_at,
        event: "update",
        item_id: programs(:program).id,
        item_type: "Program",
        updated_at: created_at
      ),
      Log.create!(created_at: created_at, updated_at: created_at),
      JobContext.create!(
        active_job_id: SecureRandom.uuid,
        created_at: created_at,
        updated_at: created_at
      ),
      SolidCableMessage.create!(
        channel: "cleaning:test",
        channel_hash: created_at.to_i,
        created_at: created_at,
        payload: "{}"
      )
    ]
  end
end
