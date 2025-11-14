# frozen_string_literal: true

class ReplProgramEvaluateJob < ContextJob
  queue_as :default

  def perform_with_context(repl_program:)
    repl_program.evaluate!
  end
end
