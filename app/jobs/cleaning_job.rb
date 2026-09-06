# frozen_string_literal: true

class CleaningJob < ContextJob
  BATCH_SIZE = 1_000
  RETENTION_PERIOD = 1.month

  queue_as(:default)

  limits_concurrency(key: "CleaningJob", on_conflict: :discard)

  def perform_with_context
    obsolete(StepExecution, :step_id).delete_all
    obsolete(SubscriptionExecution, :subscription_id)
      .where.not(id: StepExecution.select(:subscription_execution_id))
      .delete_all
    obsolete(ProgramExecution, :program_id).delete_all

    Guest.expired.delete_all

    cutoff = RETENTION_PERIOD.ago

    [Version, Log, JobContext, SolidCableMessage].each do |model|
      model.where(created_at: ...cutoff).limit(BATCH_SIZE).delete_all
    end
  end

  private

  def obsolete(model, parent_key)
    latest =
      model.select("DISTINCT ON (#{parent_key}) id").order(
        parent_key,
        created_at: :desc,
        id: :desc
      )

    model.where(status: %w[done errored]).where.not(id: latest)
  end
end
