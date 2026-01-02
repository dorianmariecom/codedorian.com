# frozen_string_literal: true

class Example < ApplicationRecord
  has_many(:example_schedules, dependent: :destroy)

  accepts_nested_attributes_for(:example_schedules, allow_destroy: true)

  validate { can!(:update, :example) }
  validates(:locale, inclusion: { in: LOCALES_STRINGS })

  has_rich_text(:title)
  has_rich_text(:description)

  def self.search_fields
    examples = arel_table

    define_rich_text_join = ->(attribute_name) do
      table =
        Arel::Table.new(:action_text_rich_texts).alias(
          "#{attribute_name}_rich_texts"
        )
      join =
        examples
          .join(table, Arel::Nodes::OuterJoin)
          .on(
            table[:record_type]
              .eq(name.to_s.classify)
              .and(table[:record_id].eq(examples[:id]))
              .and(table[:name].eq(attribute_name.to_s))
          )
          .join_sources
      [table, join]
    end

    title_rich_texts, title_join = define_rich_text_join.call(:title)
    description_rich_texts, description_join =
      define_rich_text_join.call(:description)

    {
      title: {
        node: -> { title_rich_texts[:body] },
        relation: ->(scope) { scope.joins(title_join) },
        type: :string
      },
      description: {
        node: -> { description_rich_texts[:body] },
        relation: ->(scope) { scope.joins(description_join) },
        type: :string
      },
      locale: {
        node: -> { arel_table[:locale] },
        type: :string
      },
      name: {
        node: -> { arel_table[:name] },
        type: :string
      },
      input: {
        node: -> { arel_table[:input] },
        type: :string
      },
      **base_search_fields
    }
  end

  def title_sample
    Truncate.strip(title&.to_plain_text)
  end

  def description_sample
    Truncate.strip(description&.to_plain_text)
  end

  def input_sample
    Truncate.strip(input)
  end

  def name_sample
    Truncate.strip(name)
  end

  def to_s
    title_sample.presence || description_sample.presence ||
      name_sample.presence || input_sample.presence || t("to_s", id: id)
  end
end
