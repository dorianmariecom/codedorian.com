# frozen_string_literal: true

class ApplicationJob < ActiveJob::Base
  include PerformLaterConcern

  discard_on ActiveRecord::RecordNotFound
  discard_on ActiveJob::DeserializationError

  after_perform :cleanup_job_contexts

  def set_error_context(**args)
    Rails.error.set_context(**args.transform_values(&:as_json))
  end

  def cleanup_job_contexts
    JobContext.where(active_job_id: job_id).destroy_all
  end
end
