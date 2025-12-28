# frozen_string_literal: true

module DocumentationExampleConcern
  extend(ActiveSupport::Concern)

  included do
    has_rich_text(:description)

    validates(:input, presence: true)
  end

  class_methods do
    def example_search_fields
      {
        name: {
          node: -> { arel_table[:name] },
          type: :string
        },
        input: {
          node: -> { arel_table[:input] },
          type: :string
        },
        error: {
          node: -> { arel_table[:error] },
          type: :string
        },
        result: {
          node: -> { arel_table[:result] },
          type: :string
        },
        output: {
          node: -> { arel_table[:output] },
          type: :string
        }
      }
    end

    def search_fields
      { **example_search_fields, **base_search_fields }
    end
  end

  def name_sample = Truncate.strip(name)
  def input_sample = Truncate.strip(input)
  def error_sample = Truncate.strip(error)
  def result_sample = Truncate.strip(result)
  def output_sample = Truncate.strip(output)

  def to_s
    name_sample.presence || input_sample.presence || error_sample.presence ||
      output_sample.presence || result_sample.presence || t("to_s", id: id)
  end
end
