# frozen_string_literal: true

class CleaningJob < ContextJob
  queue_as(:default)

  limits_concurrency(key: "CleaningJob", on_conflict: :discard)

  def perform_with_context
    Guest.expired.delete_all
  end
end
