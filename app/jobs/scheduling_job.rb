# frozen_string_literal: true

class SchedulingJob < ContextJob
  queue_as(:scheduling)

  limits_concurrency(key: "SchedulingJob", on_conflict: :discard)

  def perform_with_context
    Program
      .includes(:program_schedules, user: :time_zones)
      .find_in_batches(batch_size: 1000) do |programs|
        # Manually fetch the latest program_execution for each program in this batch
        # to avoid N+1 queries caused by the scoped has_one association
        program_ids = programs.map(&:id)
        latest_executions_by_program =
          ProgramExecution
            .where(program_id: program_ids)
            .select("DISTINCT ON (program_id) *")
            .order("program_id, created_at DESC")
            .index_by(&:program_id)

        programs.each do |program|
          # Associate the latest execution in memory to prevent additional queries
          latest_execution = latest_executions_by_program[program.id]
          program.association(:program_execution).target = latest_execution

          perform_later(
            SchedulingProgramJob,
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
  end
end
