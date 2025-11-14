# frozen_string_literal: true

module PerformLaterConcern
  def perform_later(
    clazz,
    wait_until: nil,
    arguments: nil,
    context: nil,
    current: nil
  )
    job = clazz.set(wait_until: wait_until)
    job = job.perform_later(**arguments, current: current, context: context)
    JobContext.create!(active_job_id: job.job_id, context: context)
  end
end
