# frozen_string_literal: true

class EvaluateAndScheduleJob < ApplicationJob
  queue_as :default

  def perform(program:)
    Current.with(user: program.user) do
      program.evaluate!
      program.schedule!
    end
  end
end
