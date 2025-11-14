# frozen_string_literal: true

class ApplicationJob < ActiveJob::Base
  include PerformLaterConcern

  discard_on ActiveRecord::RecordNotFound
  discard_on ActiveJob::DeserializationError

  def set_error_context(**args)
    Rails.error.set_context(**args.transform_values(&:as_json))
  end
end
