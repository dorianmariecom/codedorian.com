# frozen_string_literal: true

class ReplProgramEvaluateJob < ApplicationJob
  queue_as :default

  def perform(repl_program:)
    Current.with(user: repl_program.user) { repl_program.evaluate! }
  end
end
