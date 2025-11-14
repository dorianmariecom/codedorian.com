# frozen_string_literal: true

class SchedulingJob < ApplicationJob
  queue_as(:default)

  limits_concurrency(key: "SchedulingJob", on_conflict: :discard)

  def perform
    Program.find_each do |program|
      perform_later(
        SchedulingProgramJob,
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
