# frozen_string_literal: true

class JobReadyExecution < SolidQueue::ReadyExecution
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

  validate { can!(:update, :job_ready_execution) }

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
      priority: {
        node: -> { arel_table[:priority] },
        type: :integer
      },
      **base_search_fields
    }
  end

  def queue_name_sample
    Truncate.strip(queue_name)
  end

  def priority_sample
    Truncate.strip(priority)
  end

  def to_s
    queue_name_sample.presence || priority_sample.presence || t("to_s", id: id)
  end
end
