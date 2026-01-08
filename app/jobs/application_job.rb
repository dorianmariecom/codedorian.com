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
      JobContext.where(active_job_id: job_id).delete_all
    end
  end

  def current_user
    Current.user
  end
end
