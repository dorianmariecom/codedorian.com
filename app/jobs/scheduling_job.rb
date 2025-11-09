# frozen_string_literal: true

class SchedulingJob < ApplicationJob
  queue_as :default

  def perform
    Program.find_each do |program|
      SchedulingProgramJob.perform_later(program: program)
    end
  end
end
