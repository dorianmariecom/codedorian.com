# frozen_string_literal: true

class Page < ApplicationRecord
  belongs_to(:user, default: -> { Current.user! }, touch: true)
  belongs_to(:parent, class_name: "Page", optional: true, touch: true)

  has_rich_text(:title_en)
  has_rich_text(:title_fr)
  has_rich_text(:description_en)
  has_rich_text(:description_fr)
  has_rich_text(:body_en)
  has_rich_text(:body_fr)

  scope(:where_user, ->(user) { where(user: user) })
  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }

  def self.search_fields
    pages = arel_table

    define_rich_text_join = ->(attribute_name) do
      table =
        Arel::Table.new(:action_text_rich_texts).alias(
          "#{attribute_name}_rich_texts"
        )
      join =
        pages
          .join(table, Arel::Nodes::OuterJoin)
          .on(
            table[:record_type]
              .eq(name.to_s.classify)
              .and(table[:record_id].eq(pages[:id]))
              .and(table[:name].eq(attribute_name.to_s))
          )
          .join_sources
      [table, join]
    end

    title_en_rich_texts, title_en_join = define_rich_text_join.call(:title_en)
    title_fr_rich_texts, title_fr_join = define_rich_text_join.call(:title_fr)
    description_en_rich_texts, description_en_join =
      define_rich_text_join.call(:description_en)
    description_fr_rich_texts, description_fr_join =
      define_rich_text_join.call(:description_fr)
    body_en_rich_texts, body_en_join = define_rich_text_join.call(:body_en)
    body_fr_rich_texts, body_fr_join = define_rich_text_join.call(:body_fr)

    {
      title_en: {
        node: -> { title_en_rich_texts[:body] },
        relation: ->(scope) { scope.joins(title_en_join) },
        type: :string
      },
      title_fr: {
        node: -> { title_fr_rich_texts[:body] },
        relation: ->(scope) { scope.joins(title_fr_join) },
        type: :string
      },
      description_en: {
        node: -> { description_en_rich_texts[:body] },
        relation: ->(scope) { scope.joins(description_en_join) },
        type: :string
      },
      description_fr: {
        node: -> { description_fr_rich_texts[:body] },
        relation: ->(scope) { scope.joins(description_fr_join) },
        type: :string
      },
      body_en: {
        node: -> { body_en_rich_texts[:body] },
        relation: ->(scope) { scope.joins(body_en_join) },
        type: :string
      },
      body_fr: {
        node: -> { body_fr_rich_texts[:body] },
        relation: ->(scope) { scope.joins(body_fr_join) },
        type: :string
      },
      **base_search_fields,
      **User.associated_search_fields
    }
  end

  def title_en_sample
    Truncate.strip(title_en&.to_plain_text)
  end

  def title_fr_sample
    Truncate.strip(title_fr&.to_plain_text)
  end

  def description_en_sample
    Truncate.strip(description_en&.to_plain_text)
  end

  def description_fr_sample
    Truncate.strip(description_fr&.to_plain_text)
  end

  def body_en_sample
    Truncate.strip(body_en&.to_plain_text)
  end

  def body_fr_sample
    Truncate.strip(body_fr&.to_plain_text)
  end

  def path_sample
    Truncate.strip(path)
  end

  def to_s
    path_sample.presence || title_en_sample.presence ||
      title_fr_sample.presence || description_en_sample.presence ||
      description_fr_sample.presence || body_en_sample.presence ||
      body_fr_sample.presence || t("to_s", id: id)
  end
end
