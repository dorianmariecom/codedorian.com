# frozen_string_literal: true

class ProgramEvaluateJob < ContextJob
  queue_as :default

  def perform_with_context(program:)
    program.evaluate!
  end
end
