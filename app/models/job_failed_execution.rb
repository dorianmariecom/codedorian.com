# frozen_string_literal: true

class JobFailedExecution < SolidQueue::FailedExecution
  include(RecordConcern)

  belongs_to(:job, touch: true)

  has_many(:job_contexts, through: :job)

  scope(:where_job, ->(job) { where(job: job) })

  %i[
    address
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
    scope(
      :"where_#{model}",
      ->(instance) do
        value = instance.respond_to?(:id) ? instance.id : instance
        joins(:job_contexts).where(
          "job_contexts.context @> ?",
          { model => { id: value } }.to_json
        )
      end
    )
  end

  validate { can!(:update, :job_failed_execution) }
  validate(:parse_and_validate_error, on: :controller)

  def self.search_fields
    {
      job_id: {
        node: -> { arel_table[:job_id] },
        type: :integer
      },
      error: {
        node: -> { arel_table[:error] },
        type: :string
      },
      **base_search_fields
    }
  end

  def parse_and_validate_error
    self.error = JSON.parse(error.to_s)
  rescue JSON::ParserError
    errors.add(:error, t("invalid_json"))
  end

  def error_sample
    Truncate.strip(error.to_json)
  end

  def error_json
    JSON.pretty_generate(error)
  end

  def to_s
    error_sample.presence || t("to_s", id: id)
  end
end
