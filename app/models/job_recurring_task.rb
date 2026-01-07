# frozen_string_literal: true

class JobRecurringTask < SolidQueue::RecurringTask
  include(RecordConcern)

  validate { can!(:update, :job_recurring_task) }

  def self.search_fields
    {
      key: {
        node: -> { arel_table[:key] },
        type: :string
      },
      class_name: {
        node: -> { arel_table[:class_name] },
        type: :string
      },
      command: {
        node: -> { arel_table[:command] },
        type: :string
      },
      schedule: {
        node: -> { arel_table[:schedule] },
        type: :string
      },
      queue_name: {
        node: -> { arel_table[:queue_name] },
        type: :string
      },
      priority: {
        node: -> { arel_table[:priority] },
        type: :integer
      },
      static: {
        node: -> { arel_table[:static] },
        type: :boolean
      },
      arguments: {
        node: -> { arel_table[:arguments] },
        type: :string
      },
      description: {
        node: -> { arel_table[:description] },
        type: :string
      },
      **base_search_fields
    }
  end

  def arguments=(arguments)
    arguments.is_a?(String) ? self.arguments = JSON.parse(arguments) : super
  rescue JSON::ParserError
    errors.add(:arguments, t("invalid_json"))
  end

  def key_sample
    Truncate.strip(key)
  end

  def class_name_sample
    Truncate.strip(class_name)
  end

  def schedule_sample
    Truncate.strip(schedule)
  end

  def queue_name_sample
    Truncate.strip(queue_name)
  end

  def description_sample
    Truncate.strip(description)
  end

  def command_sample
    Truncate.strip(command)
  end

  def arguments_sample
    Truncate.strip(arguments.to_json)
  end

  def arguments_json
    JSON.pretty_generate(arguments)
  end

  def to_s
    key_sample.presence || class_name_sample.presence ||
      schedule_sample.presence || queue_name_sample.presence ||
      description_sample.presence || command_sample.presence ||
      arguments_sample.presence || t("to_s", id: id)
  end
end
