# frozen_string_literal: true

class Error < SolidErrors::Error
  include(Search)

  has_many :occurrences, class_name: "ErrorOccurrence", dependent: :destroy

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
    repl_execution
    repl_program
    repl_prompt
    repl_session
    time_zone
    token
    user
  ].each do |model|
    scope :"where_#{model}",
          ->(instance) { joins(:occurrences).where(<<~SQL.squish, instance) }
      (solid_errors_occurrences.context->'#{model}'->>'id')::bigint = ?
    SQL
  end

  def self.search_fields
    {
      id: {
        node: -> { arel_table[:id] },
        type: :integer
      },
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

  def to_s
    Truncate.strip("#{exception_class}: #{message}")
  end
end
