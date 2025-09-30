# frozen_string_literal: true

class ProgramPromptGenerateJob < ApplicationJob
  queue_as :default

  def perform(program_prompt:)
    Current.with(user: program_prompt.user) { program_prompt.generate! }
  end
end
