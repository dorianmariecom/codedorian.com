# frozen_string_literal: true

class SchedulingProgramJob < ContextJob
  queue_as(:scheduling)

  limits_concurrency(key: ->(program_id:, **) { program_id }, on_conflict: :discard)

  def perform_with_context(program_id:)
    program = Program
      .includes(:program_schedules, :program_execution, user: :time_zones)
      .find(program_id)
    
    return unless program.scheduled_now?

    perform_later(
      ProgramEvaluateJob,
      arguments: {
        program_id: program.id
      },
      priority: program.duration_in_seconds,
      context: {
        user_id: program.user_id,
        program_id: program.id
      },
      current: {
        user_id: program.user_id,
        program_id: program.id
      }
    )
  end
end
