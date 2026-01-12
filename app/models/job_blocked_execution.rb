# frozen_string_literal: true

class JobBlockedExecution < SolidQueue::BlockedExecution
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
      ->(instance) { joins(:job_contexts).where(<<~SQL.squish, instance) }
              job_contexts.context->'#{model}'->>'id' = ?
            SQL
    )
  end

  validate { can!(:update, :job_blocked_execution) }

  def self.search_fields
    {
      job_id: {
        node: -> { arel_table[:job_id] },
        type: :integer
      },
      queue_name: {
        node: -> { arel_table[:queue_name] },
        type: :string
      },
      concurrency_key: {
        node: -> { arel_table[:concurrency_key] },
        type: :string
      },
      priority: {
        node: -> { arel_table[:priority] },
        type: :integer
      },
      expires_at: {
        node: -> { arel_table[:expires_at] },
        type: :datetime
      },
      **base_search_fields
    }
  end

  def queue_name_sample
    Truncate.strip(queue_name)
  end

  def concurrency_key_sample
    Truncate.strip(concurrency_key)
  end

  def priority_sample
    Truncate.strip(priority)
  end

  def expires_at_sample
    Truncate.strip(expires_at)
  end

  def to_s
    queue_name_sample.presence || concurrency_key_sample.presence ||
      priority_sample.presence || expires_at_sample.presence ||
      t("to_s", id: id)
  end
end
