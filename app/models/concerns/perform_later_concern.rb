# frozen_string_literal: true

module PerformLaterConcern
  def perform_later(
    clazz,
    wait_until: nil,
    arguments: nil,
    priority: nil,
    context: nil,
    current: nil
  )
    PaperTrail.request(enabled: false) do
      job = clazz.set(wait_until: wait_until, priority: priority)
      job = job.perform_later(**arguments, current: current, context: context)

      if job.successfully_enqueued?
        JobContext.create!(active_job_id: job.job_id, context: context)
      end
    end
  end
end
