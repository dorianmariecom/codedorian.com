# frozen_string_literal: true

class SchedulingJob < ContextJob
  queue_as(:scheduling)

  limits_concurrency(key: "SchedulingJob", on_conflict: :discard)

  def perform_with_context
    Program
      .includes(:program_schedules, :program_execution, user: :time_zones)
      .find_each do |program|
        perform_later(
          SchedulingProgramJob,
          arguments: {
            program_id: program.id
          },
          context: {
            user_id: program.user_id,
            program_id: program.id
          },
          current: {
            user: program.user,
            program: program
          }
        )
      end
  end
end
