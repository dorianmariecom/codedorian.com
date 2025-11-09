# frozen_string_literal: true

class SchedulingProgramJob < ApplicationJob
  queue_as :default

  limits_concurrency key: ->(program:) { program }

  def perform(program:)
    Current.with(user: program.user, program: program) do
      if program.scheduled_now?
        ProgramEvaluateJob.perform_later(program: program)
      end
    end
  end
end
