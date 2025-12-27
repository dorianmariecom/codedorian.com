# frozen_string_literal: true

class ProgramEvaluateJob < ContextJob
  queue_as(:evaluate)

  def perform_with_context(program_id:)
    program = Program.find(program_id)
    program.evaluate!
  end
end
