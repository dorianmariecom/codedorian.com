# frozen_string_literal: true

class ApplicationJob < ActiveJob::Base
  discard_on ActiveRecord::RecordNotFound
  discard_on ActiveJob::DeserializationError
end
