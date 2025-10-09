# frozen_string_literal: true

class JobContext < ApplicationRecord
  belongs_to(
    :job,
    primary_key: :active_job_id,
    foreign_key: :active_job_id,
    inverse_of: :job_contexts
  )
end
