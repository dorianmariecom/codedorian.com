# frozen_string_literal: true

class JobRecurringExecution < SolidQueue::RecurringExecution
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
    repl_execution
    repl_program
    repl_prompt
    repl_session
    time_zone
    token
    user
  ].each do |model|
    scope :"where_#{model}",
          ->(instance) { joins(:job_contexts).where(<<~SQL.squish, instance) }
              job_contexts.context->'#{model}'->>'id' = ?
            SQL
  end

  validate { can!(:update, :job_recurring_execution) }

  def self.search_fields
    {
      job_id: {
        node: -> { arel_table[:job_id] },
        type: :integer
      },
      task_key: {
        node: -> { arel_table[:task_key] },
        type: :string
      },
      run_at: {
        node: -> { arel_table[:run_at] },
        type: :datetime
      },
      **base_search_fields
    }
  end

  def task_key_sample
    Truncate.strip(task_key)
  end

  def run_at_sample
    Truncate.strip(run_at)
  end

  def to_s
    task_key_sample.presence || run_at_sample.presence || t("to_s", id: id)
  end
end
