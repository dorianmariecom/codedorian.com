# frozen_string_literal: true

class ReplPromptGenerateJob < ContextJob
  queue_as :default

  def perform_with_context(repl_prompt:)
    repl_prompt.generate!
  end
end
