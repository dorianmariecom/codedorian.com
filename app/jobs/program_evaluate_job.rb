# frozen_string_literal: true

class ProgramEvaluateJob < ContextJob
  queue_as(:evaluate)

  def perform_with_context(program:, program_execution:)
    program.evaluate!(program_execution: program_execution)
  end
end
