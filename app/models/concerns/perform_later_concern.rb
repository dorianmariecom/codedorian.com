# frozen_string_literal: true

module PerformLaterConcern
  def perform_later(clazz, wait_until: nil, arguments: nil, context: nil)
    job = clazz.set(wait_until: wait_until).perform_later(arguments)
    JobContext.create!(active_job_id: job.job_id, context: context)
  end
end
