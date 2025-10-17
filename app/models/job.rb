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

  scope(
    :where_current_user,
    ->(current_user) do
      joins(:job_contexts).where(
        "job_contexts.context->'current_user'->>'id' = ?",
        current_user
      )
    end
  )

  scope(
    :where_user,
    ->(user) do
      joins(:job_contexts).where(
        "job_contexts.context->'user'->>'id' = ?",
        user
      )
    end
  )

  scope(
    :where_program,
    ->(program) do
      joins(:job_contexts).where(
        "job_contexts.context->'program'->>'id' = ?",
        program
      )
    end
  )

  scope(
    :where_program_prompt,
    ->(program_prompt) do
      joins(:job_contexts).where(
        "job_contexts.context->'program_prompt'->>'id' = ?",
        program_prompt
      )
    end
  )

  scope(
    :where_repl_session,
    ->(repl_session) do
      joins(:job_contexts).where(
        "job_contexts.context->'repl_session'->>'id' = ?",
        repl_session
      )
    end
  )

  scope(
    :where_repl_program,
    ->(repl_program) do
      joins(:job_contexts).where(
        "job_contexts.context->'repl_program'->>'id' = ?",
        repl_program
      )
    end
  )

  scope(
    :where_repl_prompt,
    ->(repl_prompt) do
      joins(:job_contexts).where(
        "job_contexts.context->'repl_prompt'->>'id' = ?",
        repl_prompt
      )
    end
  )

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
    find_each(&:discard!)
  end

  def self.retry_all
    find_each(&:retry!)
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
