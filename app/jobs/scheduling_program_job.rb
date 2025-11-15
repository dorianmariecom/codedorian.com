# frozen_string_literal: true

class SchedulingProgramJob < ContextJob
  queue_as(:default)

  limits_concurrency(key: ->(program:, **) { program }, on_conflict: :discard)

  def perform_with_context(program:)
    return unless program.scheduled_now?

    perform_later(
      ProgramEvaluateJob,
      arguments: {
        program: program
      },
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
