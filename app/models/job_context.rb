# frozen_string_literal: true

class JobContext < ApplicationRecord
  belongs_to(
    :job,
    primary_key: :active_job_id,
    foreign_key: :active_job_id,
    inverse_of: :job_contexts,
    optional: true
  )

  %i[
    address
    attachment
    current_user
    datum
    device
    email_address
    error
    error_occurrence
    guest
    handle
    job
    job_context
    message
    name
    password
    phone_number
    program
    program_execution
    program_prompt
    program_prompt_schedule
    program_schedule
    repl_execution
    repl_program
    repl_prompt
    repl_session
    time_zone
    token
    user
  ].each do |model|
    scope :"where_#{model}", ->(instance) { where(<<~SQL.squish, instance) }
      (
        (job_contexts.context->>'#{model}')::jsonb
      )->>'id'::bigint = ?
    SQL
  end
end
