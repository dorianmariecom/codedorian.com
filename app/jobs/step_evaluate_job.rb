# frozen_string_literal: true

class StepEvaluateJob < ContextJob
  queue_as(:evaluate)

  limits_concurrency(
    key: ->(step_execution:, **) { step_execution },
    on_conflict: :discard
  )

  def perform_with_context(step_execution:)
    step_execution.evaluate!
  end
end
