# frozen_string_literal: true

class ProgramEvaluateAndScheduleJob < ApplicationJob
  queue_as :default

  def perform(program:)
    Rails.error.set_context(user: program.user, program: program)

    Current.with(user: program.user) do
      program.evaluate!
      program.schedule!
    end
  end
end
