# frozen_string_literal: true

class JobClaimedExecution < SolidQueue::ClaimedExecution
  include(RecordConcern)

  belongs_to(:job, touch: true)

  has_many(:job_contexts, through: :job)

  scope(:where_job, ->(job) { where(job: job) })

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
    scope :"where_#{model}",
          ->(instance) { joins(:job_contexts).where(<<~SQL.squish, instance) }
              job_contexts.context->'#{model}'->>'id' = ?
            SQL
  end

  validate { can!(:update, :job_claimed_execution) }

  def self.search_fields
    {
      job_id: {
        node: -> { arel_table[:job_id] },
        type: :integer
      },
      process_id: {
        node: -> { arel_table[:process_id] },
        type: :integer
      },
      **base_search_fields
    }
  end

  def process_id_sample
    Truncate.strip(process_id)
  end

  def to_s
    process_id_sample.presence || t("to_s", id: id)
  end
end
