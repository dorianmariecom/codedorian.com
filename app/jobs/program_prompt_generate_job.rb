# frozen_string_literal: true

class ProgramPromptGenerateJob < ContextJob
  queue_as(:generate)

  def perform_with_context(program_prompt:)
    program_prompt.generate!
  end
end
