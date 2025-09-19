# frozen_string_literal: true

class ErrorOccurrence < SolidErrors::Occurrence
  include(Search)

  belongs_to(:error, touch: true)

  scope :where_user, -> (user) { where("(context->>'user_id')::bigint = ?", user) }

  def self.search_fields
    {
      id: {
        node: -> { arel_table[:id] },
        type: :integer
      },
      backtrace: {
        node: -> { arel_table[:backtrace] },
        type: :string
      },
      context: {
        node: -> { arel_table[:context] },
        type: :string
      },
      updated_at: {
        node: -> { arel_table[:updated_at] },
        type: :datetime
      },
      created_at: {
        node: -> { arel_table[:created_at] },
        type: :datetime
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
      }
    }
  end

  def app_backtrace
    Backtrace.app(backtrace)
  end

  def context_json
    JSON.pretty_generate(context)
  end
end
