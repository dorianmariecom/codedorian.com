# frozen_string_literal: true

class SchedulingProgramJob < ApplicationJob
  queue_as(:default)

  limits_concurrency(key: ->(program:) { program }, on_conflict: :discard)

  def perform(program:)
    if program.scheduled_now?
      perform_later(
        ProgramEvaluateJob,
        arguments: {
          program: program
        },
        context: {
          user: program.user,
          program: program
        }
      )
    end
  end
end
