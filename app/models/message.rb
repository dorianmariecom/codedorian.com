# frozen_string_literal: true

class Message < ApplicationRecord
  belongs_to(
    :from_user,
    class_name: "User",
    default: -> { Current.user! },
    touch: true
  )
  belongs_to(
    :to_user,
    class_name: "User",
    default: -> { Current.user! },
    touch: true
  )

  has_rich_text(:subject)
  has_rich_text(:body)

  scope(
    :left_joins_from_users,
    -> do
      joins(
        "LEFT JOIN users AS from_users ON from_users.id = messages.from_user_id"
      )
    end
  )
  scope(
    :left_joins_to_users,
    -> do
      joins("LEFT JOIN users AS to_users ON to_users.id = messages.to_user_id")
    end
  )

  validate { can!(:update, from_user) }
  validate { can!(:update, to_user) }

  before_validation { self.from_user ||= Current.user! }
  before_validation { self.to_user ||= Current.user! }

  def self.search_fields
    messages = arel_table

    define_rich_text_join = ->(attribute_name) do
      table =
        Arel::Table.new(:action_text_rich_texts).alias(
          "#{attribute_name}_rich_texts"
        )
      join =
        messages
          .join(table, Arel::Nodes::OuterJoin)
          .on(
            table[:record_type]
              .eq(name.to_s.classify)
              .and(table[:record_id].eq(messages[:id]))
              .and(table[:name].eq(attribute_name.to_s))
          )
          .join_sources
      [table, join]
    end

    subject_rich_texts, subject_join = define_rich_text_join.call(:subject)
    body_rich_texts, body_join = define_rich_text_join.call(:body)

    from_user_table = User.arel_table.alias(:from_users)
    to_user_table = User.arel_table.alias(:to_users)

    {
      subject: {
        node: -> { subject_rich_texts[:body] },
        relation: ->(scope) { scope.joins(subject_join) },
        type: :string
      },
      body: {
        node: -> { body_rich_texts[:body] },
        relation: ->(scope) { scope.joins(body_join) },
        type: :string
      },
      "from_user:id": {
        node: -> { from_user_table[:id] },
        relation: ->(scope) { scope.left_joins_from_users },
        type: :integer
      },
      "from_user:admin": {
        node: -> { from_user_table[:admin] },
        relation: ->(scope) { scope.left_joins_from_users },
        type: :boolean
      },
      "from_user:verified": {
        node: -> { from_user_table[:verified] },
        relation: ->(scope) { scope.left_joins_from_users },
        type: :boolean
      },
      "from_user:updated_at": {
        node: -> { from_user_table[:updated_at] },
        relation: ->(scope) { scope.left_joins_from_users },
        type: :datetime
      },
      "from_user:created_at": {
        node: -> { from_user_table[:created_at] },
        relation: ->(scope) { scope.left_joins_from_users },
        type: :datetime
      },
      "to_user:id": {
        node: -> { to_user_table[:id] },
        relation: ->(scope) { scope.left_joins_to_users },
        type: :integer
      },
      "to_user:admin": {
        node: -> { to_user_table[:admin] },
        relation: ->(scope) { scope.left_joins_to_users },
        type: :boolean
      },
      "to_user:verified": {
        node: -> { to_user_table[:verified] },
        relation: ->(scope) { scope.left_joins_to_users },
        type: :boolean
      },
      "to_user:updated_at": {
        node: -> { to_user_table[:updated_at] },
        relation: ->(scope) { scope.left_joins_to_users },
        type: :datetime
      },
      "to_user:created_at": {
        node: -> { to_user_table[:created_at] },
        relation: ->(scope) { scope.left_joins_to_users },
        type: :datetime
      },
      **base_search_fields
    }
  end

  def to_s
    subject&.to_plain_text.presence || body&.to_plain_text.presence ||
      t("to_s", id: id)
  end

  def to_code
    Code::Object::Message.new(id: id)
  end
end
