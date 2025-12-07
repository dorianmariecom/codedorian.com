# frozen_string_literal: true

class ReplSessionEvaluateJob < ContextJob
  queue_as(:evaluate)

  def perform_with_context(repl_session:)
    repl_session.evaluate!
  end
end
