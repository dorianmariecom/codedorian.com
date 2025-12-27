# frozen_string_literal: true

class SchedulingJob < ContextJob
  queue_as(:scheduling)

  limits_concurrency(key: "SchedulingJob", on_conflict: :discard)

  BATCH_SIZE = 100
  BATCH_DELAY = 0.1.seconds

  def perform_with_context
    pool = ActiveRecord::Base.connection_pool
    
    # Log connection pool stats before starting
    log_pool_stats(pool, "before")

    # Use explicit connection pool management to ensure proper connection checkout/release
    pool.with_connection do
      programs = Program
        .includes(:program_schedules, :program_execution, user: :time_zones)
        .to_a

      Rails.logger.info("SchedulingJob: Processing #{programs.size} programs in batches of #{BATCH_SIZE}")

      # Process programs in batches to reduce connection pool pressure
      programs.each_slice(BATCH_SIZE).with_index do |batch, index|
        batch.each do |program|
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

        # Log pool stats after each batch
        log_pool_stats(pool, "batch #{index + 1}")

        # Brief pause between batches to allow connection pool to recover
        # Skip delay for the last batch
        sleep(BATCH_DELAY) if index < (programs.size / BATCH_SIZE)
      end
    end

    # Log connection pool stats after completion
    log_pool_stats(pool, "after")
  end

  private

  def log_pool_stats(pool, stage)
    stats = pool.stat
    Rails.logger.info(
      "SchedulingJob connection pool (#{stage}): " \
      "size=#{stats[:size]} " \
      "connections=#{stats[:connections]} " \
      "busy=#{stats[:busy]} " \
      "dead=#{stats[:dead]} " \
      "idle=#{stats[:idle]} " \
      "waiting=#{stats[:waiting]}"
    )
  end
end
