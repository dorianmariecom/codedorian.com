# frozen_string_literal: true

class CleaningJob < ContextJob
  RETENTION_PERIOD = 1.day

  queue_as(:default)

  limits_concurrency(key: "CleaningJob", on_conflict: :discard)

  def perform_with_context
    obsolete(StepExecution, :step_id).destroy_all
    obsolete(SubscriptionExecution, :subscription_id)
      .where.not(
        id:
          StepExecution.where(status: %w[initialized in_progress]).select(
            :subscription_execution_id
          )
      )
      .find_each(&:destroy!)
    obsolete(ProgramExecution, :program_id).delete_all

    cutoff = RETENTION_PERIOD.ago

    Job.where(finished_at: ...cutoff).delete_all
    JobBatch
      .where(finished_at: ...cutoff)
      .where
      .missing(:jobs, :batch_executions)
      .delete_all
    Hashcash.where(expires_at: ..Time.current).delete_all
    Guest.expired.delete_all
    Session.expired_guests.delete_all
    JobContext.where.missing(:job).delete_all

    ErrorOccurrence.where(created_at: ...cutoff).delete_all
    Error
      .where(resolved_at: ...cutoff)
      .where
      .missing(:error_occurrences)
      .delete_all

    Version.where(created_at: ...cutoff).delete_all
    Log.where(created_at: ...cutoff).delete_all
    SolidCableMessage.where(created_at: ...cutoff).delete_all
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
