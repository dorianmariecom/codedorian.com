# frozen_string_literal: true

class SchedulingProgramJob < ApplicationJob
  queue_as(:default)

  def perform(program:)
    Current.with(user: program.user, program: program) do
      Program.with_advisory_lock("SchedulingProgramJob:#{program.id}") do
        if program.scheduled_now?
          ProgramEvaluateJob.perform_later(program: program)
        end
      end
    end
  end
end
