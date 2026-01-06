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
    scope :"where_#{model}",
          ->(instance) do
            joins(:job_contexts).where(<<~SQL.squish, instance.try(:id))
      job_contexts.context->'#{model}'->>'id' = ?
    SQL
          end
  end

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

  def pretty_json_arguments
    JSON.pretty_generate(arguments)
  end

  def class_name_sample
    Truncate.strip(class_name)
  end

  def queue_name_sample
    Truncate.strip(queue_name)
  end

  def arguments_sample
    Truncate.strip(arguments.to_json)
  end

  def to_s
    class_name_sample.presence || queue_name_sample.presence ||
      arguments_sample.presence || t("to_s", id: id)
  end
end
