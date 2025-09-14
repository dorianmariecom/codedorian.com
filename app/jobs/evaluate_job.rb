# frozen_string_literal: true

class EvaluateJob < ApplicationJob
  queue_as :default

  def perform(program:)
    Current.with(user: program.user) { program.evaluate! }
  end
end
