# frozen_string_literal: true

class SchedulingJob < ApplicationJob
  queue_as(:default)

  limits_concurrency(on_conflict: :discard)

  def perform
    Program.find_each do |program|
      SchedulingProgramJob.perform_later(program: program)
    end
  end
end
