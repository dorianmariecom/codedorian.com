# frozen_string_literal: true

class SchedulingSubscriptionJob < ContextJob
  queue_as(:scheduling)

  limits_concurrency(
    key: ->(subscription:, **) { subscription },
    on_conflict: :discard
  )

  def perform_with_context(subscription:)
    subscription.evaluate_due_steps!
  end
end
