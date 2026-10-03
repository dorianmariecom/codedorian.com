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

  test "keeps the newest execution per parent and resolves ties by id" do
    [
      program_executions(:program_execution),
      step_executions(:step_execution)
    ].each do |original|
      first = copy(original, created_at: original.created_at + 1.day)
      latest = copy(original, created_at: first.created_at)
      backdated = copy(original, created_at: original.created_at - 1.day)
      other = nil
      other_parent =
        original.is_a?(ProgramExecution) ? programs(:other_program) : nil
      other = copy(original, program_id: other_parent.id) if other_parent

      CleaningJob.perform_now

      assert_not(original.class.exists?(original.id))
      assert_not(first.class.exists?(first.id))
      assert_not(backdated.class.exists?(backdated.id))
      assert(latest.class.exists?(latest.id))
      assert(other.class.exists?(other.id)) if other
    end
  end

  test "deletes old steps before their subscription executions" do
    original = subscription_executions(:subscription_execution)
    latest = copy(original, created_at: original.created_at + 1.day)
    old_step = step_executions(:step_execution)
    latest_step =
      copy(
        old_step,
        subscription_execution_id: latest.id,
        created_at: old_step.created_at + 1.day
      )

    CleaningJob.perform_now

    assert_not(SubscriptionExecution.exists?(original.id))
    assert_not(StepExecution.exists?(old_step.id))
    assert(SubscriptionExecution.exists?(latest.id))
    assert(StepExecution.exists?(latest_step.id))
  end

  test "preserves older parents required by retained steps" do
    original = subscription_executions(:subscription_execution)
    latest = copy(original, created_at: original.created_at + 1.day)

    2.times { CleaningJob.perform_now }

    assert(SubscriptionExecution.exists?(original.id))
    assert(SubscriptionExecution.exists?(latest.id))
    assert(StepExecution.exists?(step_executions(:step_execution).id))
  end

  test "preserves unfinished executions until they finish" do
    original = program_executions(:program_execution)
    original.update_columns(status: "in_progress")
    latest =
      copy(original, status: "done", created_at: original.created_at + 1.day)

    CleaningJob.perform_now
    assert(ProgramExecution.exists?(original.id))

    original.update_columns(status: "done")
    CleaningJob.perform_now

    assert_not(ProgramExecution.exists?(original.id))
    assert(ProgramExecution.exists?(latest.id))
  end

  test "nullifies delivery references to obsolete executions and continues cleanup" do
    Current.with(user: users(:admin)) do
      original = step_executions(:step_execution)
      latest = copy(original, created_at: original.created_at + 1.day)
      unreferenced = copy(original, created_at: original.created_at - 1.day)
      channel = DeliveryChannel.create!(key: "messages", enabled: true)
      destination =
        DeliveryDestination.create!(
          user: original.user,
          delivery_channel: channel
        )
      delivery =
        Delivery.create!(
          subscription: original.subscription,
          delivery_destination: destination,
          step_execution: original,
          event_key: "cleaning"
        )
      retained_delivery =
        Delivery.create!(
          subscription: original.subscription,
          delivery_destination: destination,
          step_execution: latest,
          event_key: "latest-execution"
        )
      standalone_delivery =
        Delivery.create!(
          subscription: original.subscription,
          delivery_destination: destination,
          event_key: "without-execution"
        )
      old_log = Log.create!(created_at: 2.months.ago)

      CleaningJob.perform_now

      assert_nil delivery.reload.step_execution_id
      assert_equal latest.id, retained_delivery.reload.step_execution_id
      assert Delivery.exists?(standalone_delivery.id)
      assert_not StepExecution.exists?(original.id)
      assert SubscriptionExecution.exists?(original.subscription_execution_id)
      assert StepExecution.exists?(latest.id)
      assert_not StepExecution.exists?(unreferenced.id)
      assert_not Log.exists?(old_log.id)
    end
  end

  private

  def copy(record, **attributes)
    result =
      record.class.insert_all!(
        [record.attributes.except("id").merge(attributes.stringify_keys)],
        returning: %w[id]
      )
    record.class.find(result.rows.first.first)
  end

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
