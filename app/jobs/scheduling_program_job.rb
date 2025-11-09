# frozen_string_literal: true

class SchedulingProgramJob < ApplicationJob
  queue_as(:default)

  limits_concurrency(to: 1, key: ->(program:) { program }, duration: 5.minutes)

  def perform(program:)
    Current.with(user: program.user, program: program) do
      if program.scheduled_now?
        ProgramEvaluateJob.perform_later(program: program)
      end
    end
  end
end
