# frozen_string_literal: true

class ReplSessionEvaluateJob < ApplicationJob
  queue_as :default

  def perform(repl_session:)
    Current.with(user: repl_session.user) { repl_session.evaluate! }
  end
end
