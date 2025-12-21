# frozen_string_literal: true

class ApplicationJob < ActiveJob::Base
  include PerformLaterConcern

  discard_on ActiveRecord::RecordNotFound
  discard_on ActiveJob::DeserializationError

  after_perform :cleanup_job_contexts

  def set_context(**args)
    return if args.blank?

    # Convert values to JSON and back to ensure plain Ruby objects (Hash/Array/primitives)
    # This handles OpenStruct and other complex objects that can't be cast to PostgreSQL JSON
    json_safe_args = args.transform_values { |v| JSON.parse(v.as_json.to_json) }
    
    Rails.error.set_context(**json_safe_args)
    Sentry.set_tags(**sentry_hash(json_safe_args))
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
end
