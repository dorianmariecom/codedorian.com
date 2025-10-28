# frozen_string_literal: true

class Job < SolidQueue::Job
  include(Search)

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
          ->(instance) { joins(:job_contexts).where(<<~SQL.squish, instance) }
      (job_contexts.context->'#{model}'->>'id')::bigint = ?
    SQL
  end

  def self.search_fields
    {
      id: {
        node: -> { arel_table[:id] },
        type: :integer
      },
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
      updated_at: {
        node: -> { arel_table[:updated_at] },
        type: :datetime
      },
      created_at: {
        node: -> { arel_table[:created_at] },
        type: :datetime
      }
    }
  end

  def self.discard_all
    ApplicationRecord.transaction { find_each(&:discard!) }
  end

  def self.retry_all
    ApplicationRecord.transaction { find_each(&:retry!) }
  end

  def self.model_singular
    name.underscore.singularize.to_sym
  end

  def self.model_plural
    name.underscore.pluralize.to_sym
  end

  def model_singular
    self.class.name.underscore.singularize.to_sym
  end

  def model_plural
    self.class.name.underscore.pluralize.to_sym
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

  def to_s
    Truncate.strip("#{queue_name}: #{class_name}: #{arguments["arguments"]}")
  end
end
