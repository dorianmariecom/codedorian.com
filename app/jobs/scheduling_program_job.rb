# frozen_string_literal: true

class SchedulingProgramJob < ContextJob
  queue_as(:scheduling)

  limits_concurrency(key: ->(program:, **) { program }, on_conflict: :discard)

  def perform_with_context(program:)
    return unless program.scheduled_now?

    perform_later(
      ProgramEvaluateJob,
      arguments: {
        program: program
      },
      priority: program.duration_in_seconds,
      context: {
        user: program.user,
        program: program
      },
      current: {
        user: program.user,
        program: program
      }
    )
  end
end
