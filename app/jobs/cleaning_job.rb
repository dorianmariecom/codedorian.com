# frozen_string_literal: true

class CleaningJob < ContextJob
  BATCH_SIZE = 1_000
  RETENTION_PERIOD = 1.month

  queue_as(:default)

  limits_concurrency(key: "CleaningJob", on_conflict: :discard)

  def perform_with_context
    Guest.expired.delete_all

    cutoff = RETENTION_PERIOD.ago

    [Version, Log, JobContext, SolidCableMessage].each do |model|
      model.where(created_at: ...cutoff).limit(BATCH_SIZE).delete_all
    end
  end
end
