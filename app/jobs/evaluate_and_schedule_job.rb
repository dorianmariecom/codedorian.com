# frozen_string_literal: true

class EvaluateAndScheduleJob < ApplicationJob
  queue_as :default

  def perform(program:)
    Current.user = program.user

    program.evaluate!
    program.schedule!
  end
end
