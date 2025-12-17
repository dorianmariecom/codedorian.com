# frozen_string_literal: true

class ApplicationJob < ActiveJob::Base
  include PerformLaterConcern

  discard_on ActiveRecord::RecordNotFound
  discard_on ActiveJob::DeserializationError

  after_perform :cleanup_job_contexts

  def set_context(**args)
    return if args.blank?

    Rails.error.set_context(**args.transform_values(&:as_json))
    Sentry.set_tags(**args.transform_values(&:as_json))
  end

  def cleanup_job_contexts
    PaperTrail.request(enabled: false) do
      JobContext.where(active_job_id: job_id).destroy_all
    end
  end
end
