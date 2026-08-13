# frozen_string_literal: true

class SubscriptionEvaluateJob < ContextJob
  queue_as(:evaluate)

  limits_concurrency(
    key: ->(subscription:, **) { subscription },
    on_conflict: :discard
  )

  def perform_with_context(subscription:)
    subscription.evaluate!
  end
end
