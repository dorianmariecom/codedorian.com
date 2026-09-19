# frozen_string_literal: true

class JobBatchExecution < SolidQueue::BatchExecution
  include(RecordConcern)

  belongs_to(:job, touch: true)

  belongs_to(:batch, class_name: "JobBatch")

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

  validate { can!(:update, :job_batch_execution) }

  def self.search_fields
    {
      job_id: {
        node: -> { arel_table[:job_id] },
        type: :integer
      },
      batch_id: {
        node: -> { arel_table[:batch_id] },
        type: :integer
      },
      **base_search_fields
    }
  end

  def batch_sample
    Truncate.strip(batch)
  end

  def job_sample
    Truncate.strip(job)
  end

  def to_s
    Utils.join(batch_sample, job_sample, id_sample).presence || t("to_s", id:)
  end

  def to_code
    Code::Object::JobBatchExecution.new(attributes)
  end
end
