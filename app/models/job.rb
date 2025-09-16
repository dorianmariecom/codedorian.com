# frozen_string_literal: true

class Job < SolidQueue::Job
  include(Search)

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
    "#{queue_name}: #{class_name}: #{arguments["arguments"]}".truncate(
      SAMPLE_SIZE,
      omission: OMISSION
    )
  end
end
