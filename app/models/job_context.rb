# frozen_string_literal: true

class JobContext < ApplicationRecord
  belongs_to(
    :job,
    primary_key: :active_job_id,
    foreign_key: :active_job_id,
    inverse_of: :job_contexts,
    optional: true
  )

  scope(:where_job, ->(job) { where(active_job_id: job&.active_job_id) })

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
    time_zone
    token
    user
  ].each do |model|
    scope :"where_#{model}", ->(instance) { where(<<~SQL.squish, instance) }
      (job_contexts.context->'#{model}'->>'id') = ?
    SQL
  end

  validate(:parse_and_validate_context, on: :controller)

  def parse_and_validate_context
    self.context = JSON.parse(context.to_s)
  rescue JSON::ParserError
    errors.add(:context, t("invalid_json"))
  end

  def context_sample
    Truncate.strip(context.to_json)
  end

  def context_json
    JSON.pretty_generate(context)
  end

  def to_s
    context_sample.presence || t("to_s", id: id)
  end
end
