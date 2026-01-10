# frozen_string_literal: true

class Error < SolidErrors::Error
  include(RecordConcern)

  has_many :error_occurrences, dependent: :destroy

  %i[
    address
    attachment
    current_user
    datum
    device
    email_address
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
          ->(instance) do
            joins(:error_occurrences).where(<<~SQL.squish, instance)
      (solid_errors_occurrences.context->'#{model}'->>'id') = ?
    SQL
          end
  end

  def self.search_fields
    {
      exception_class: {
        node: -> { arel_table[:exception_class] },
        type: :string
      },
      fingerprint: {
        node: -> { arel_table[:fingerprint] },
        type: :string
      },
      message: {
        node: -> { arel_table[:message] },
        type: :string
      },
      severity: {
        node: -> { arel_table[:severity] },
        type: :string
      },
      source: {
        node: -> { arel_table[:source] },
        type: :string
      },
      resolved_at: {
        node: -> { arel_table[:resolved_at] },
        type: :datetime
      },
      **base_search_fields
    }
  end

  def exception_class_sample
    Truncate.strip(exception_class)
  end

  def message_sample
    Truncate.strip(message)
  end

  def to_s
    message_sample.presence || exception_class_sample.presence ||
      I18n.t("to_s", id: id)
  end
end
