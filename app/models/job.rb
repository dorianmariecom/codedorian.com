# frozen_string_literal: true

class Job < SolidQueue::Job
  include(RecordConcern)

  has_many(
    :job_contexts,
    primary_key: :active_job_id,
    foreign_key: :active_job_id,
    dependent: :destroy,
    inverse_of: :job
  )

  has_many(:job_blocked_executions, dependent: :destroy)
  has_many(:job_claimed_executions, dependent: :destroy)
  has_many(:job_failed_executions, dependent: :destroy)
  has_many(:job_ready_executions, dependent: :destroy)
  has_many(:job_recurring_executions, dependent: :destroy)
  has_many(:job_scheduled_executions, dependent: :destroy)

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
    time_zone
    token
    user
  ].each do |model|
    scope :"where_#{model}",
          ->(instance) { joins(:job_contexts).where(<<~SQL.squish, instance) }
      job_contexts.context->'#{model}'->>'id' = ?
    SQL
  end

  validate { can!(:update, :job) }
  validate(:parse_and_validate_arguments, on: :controller)

  def self.search_fields
    {
      active_job_id: {
        node: -> { arel_table[:active_job_id] },
        type: :string
      },
      arguments: {
        node: -> { arel_table[:arguments] },
        type: :string
      },
      class_name: {
        node: -> { arel_table[:class_name] },
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
      finished_at: {
        node: -> { arel_table[:finished_at] },
        type: :datetime
      },
      scheduled_at: {
        node: -> { arel_table[:scheduled_at] },
        type: :datetime
      },
      **base_search_fields
    }
  end

  def self.discard_all
    ApplicationRecord.transaction { find_each(&:discard!) }
  end

  def self.retry_all
    ApplicationRecord.transaction { find_each(&:retry!) }
  end

  def retry!
    send(:retry)
  end

  def delete!
    delete
  end

  def discard!
    discard
  rescue SolidQueue::Execution::UndiscardableError
  end

  def parse_and_validate_arguments
    self.arguments = JSON.parse(arguments.to_s)
  rescue JSON::ParserError
    errors.add(:arguments, t("invalid_json"))
  end

  def arguments_json
    JSON.pretty_generate(arguments)
  end

  def class_name_sample
    Truncate.strip(class_name)
  end

  def queue_name_sample
    Truncate.strip(queue_name)
  end

  def concurrency_key_sample
    Truncate.strip(concurrency_key)
  end

  def arguments_sample
    Truncate.strip(arguments.to_json)
  end

  def to_s
    class_name_sample.presence || queue_name_sample.presence ||
      concurrency_key_sample.presence || arguments_sample.presence ||
      t("to_s", id: id)
  end
end
