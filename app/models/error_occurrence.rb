# frozen_string_literal: true

class ErrorOccurrence < SolidErrors::Occurrence
  include(RecordConcern)

  belongs_to(:error, touch: true)

  %i[
    address
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
    scope(
      :"where_#{model}",
      ->(instance) do
        value = instance.respond_to?(:id) ? instance.id : instance
        where(
          "solid_errors_occurrences.context @> ?",
          { model => { id: value } }.to_json
        )
      end
    )
  end

  scope(:where_error, ->(error) { where(error: error) })

  validate(:parse_and_validate_context, on: :controller)

  def self.search_fields
    {
      backtrace: {
        node: -> { arel_table[:backtrace] },
        type: :string
      },
      context: {
        node: -> { arel_table[:context] },
        type: :string
      },
      "error:id": {
        node: -> { Error.arel_table[:id] },
        relation: ->(scope) { scope.left_joins(:error) },
        type: :integer
      },
      "error:exception_class": {
        node: -> { Error.arel_table[:exception_class] },
        relation: ->(scope) { scope.left_joins(:error) },
        type: :string
      },
      "error:fingerprint": {
        node: -> { Error.arel_table[:fingerprint] },
        relation: ->(scope) { scope.left_joins(:error) },
        type: :string
      },
      "error:message": {
        node: -> { Error.arel_table[:message] },
        relation: ->(scope) { scope.left_joins(:error) },
        type: :string
      },
      "error:severity": {
        node: -> { Error.arel_table[:severity] },
        relation: ->(scope) { scope.left_joins(:error) },
        type: :string
      },
      "error:source": {
        node: -> { Error.arel_table[:source] },
        relation: ->(scope) { scope.left_joins(:error) },
        type: :string
      },
      "error:resolved_at": {
        node: -> { Error.arel_table[:resolved_at] },
        relation: ->(scope) { scope.left_joins(:error) },
        type: :datetime
      },
      "error:updated_at": {
        node: -> { Error.arel_table[:updated_at] },
        relation: ->(scope) { scope.left_joins(:error) },
        type: :datetime
      },
      "error:created_at": {
        node: -> { Error.arel_table[:created_at] },
        relation: ->(scope) { scope.left_joins(:error) },
        type: :datetime
      },
      **base_search_fields
    }
  end

  def parse_and_validate_context
    self.context = JSON.parse(context.to_s)
  rescue JSON::ParserError
    errors.add(:context, t("invalid_json"))
  end

  def app_backtrace
    Backtrace.app(backtrace)
  end

  def context_json
    JSON.pretty_generate(context)
  end

  def app_backtrace_sample
    Truncate.strip(app_backtrace)
  end

  def backtrace_sample
    Truncate.strip(backtrace)
  end

  def context_sample
    Truncate.strip(context.to_json)
  end

  def to_s
    app_backtrace_sample.presence || backtrace_sample.presence ||
      context_sample.presence || I18n.t("to_s", id: id)
  end
end
