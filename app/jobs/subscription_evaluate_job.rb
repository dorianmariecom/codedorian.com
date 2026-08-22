# frozen_string_literal: true

class SubscriptionEvaluateJob < ContextJob
  queue_as(:evaluate)

  limits_concurrency(
    key: ->(subscription:, **) { subscription },
    on_conflict: :discard
  )

  def perform_with_context(subscription:, subscription_execution:)
    subscription.evaluate!(
      execution: subscription_execution
    ) do |step_execution|
      Current.set(step_execution: step_execution) { step_execution.evaluate! }
    end
  end
end
