# frozen_string_literal: true

class ApplicationJob < ActiveJob::Base
  include(CanConcern)
  include(LogConcern)
  include(PerformLaterConcern)
  include(Pundit::Authorization)

  DISCARD_ON =
    lambda do |job, error|
      set_context(job: job, error: error)
      job.cleanup_job_contexts
      log!(:discard_on)
    end

  discard_on(ActiveRecord::RecordNotFound, &DISCARD_ON)
  discard_on(ActiveJob::DeserializationError, &DISCARD_ON)

  after_perform(:cleanup_job_contexts)

  def set_context(**args)
    return if args.blank?

    Rails.error.set_context(**Log.convert(args))
    Sentry.set_tags(**sentry_hash(Log.convert(args)))
    Current.context.merge!(**Log.convert(args))
  end

  def sentry_hash(hash, prefix = nil, acc = {})
    hash.each do |k, v|
      key = [prefix, k].compact.join("_")

      v.is_a?(Hash) ? sentry_hash(v, key, acc) : acc[key.to_sym] = v
    end

    acc
  end

  def cleanup_job_contexts
    PaperTrail.request(enabled: false) do
      # Ensure the database connection is active before attempting cleanup
      # This prevents failures when the connection has been terminated due to idle timeout
      ActiveRecord::Base.connection.verify!
      JobContext.where(active_job_id: job_id).delete_all
    end
  rescue ActiveRecord::ConnectionNotEstablished, ActiveRecord::ConnectionFailed => e
    # If connection cannot be re-established, log the error and continue
    # The job has already completed, so cleanup failure should not fail the job
    Rails.logger.warn("Failed to cleanup job contexts for job #{job_id}: #{e.class} - #{e.message}")
  end

  def current_user
    Current.user
  end
end
