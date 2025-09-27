# frozen_string_literal: true

class ReplPromptGenerateJob < ApplicationJob
  queue_as :default

  def perform(repl_prompt:)
    Current.with(user: repl_prompt.user) { repl_prompt.generate! }
  end
end
