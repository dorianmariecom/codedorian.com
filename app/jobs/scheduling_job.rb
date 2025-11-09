# frozen_string_literal: true

class SchedulingJob < ApplicationJob
  queue_as :default

  def perform
    Program.for_each do |program|
      SchedulingProgram.perform_later(program: program)
    end
  end
end
