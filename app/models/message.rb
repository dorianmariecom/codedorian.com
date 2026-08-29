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
  scope(
    :where_user,
    ->(user) { where(from_user: user).or(where(to_user: user)) }
  )
  validate { can!(:update, from_user) }
  validate { can!(:update, to_user) }

  before_validation { self.from_user ||= Current.user! }
  before_validation { self.to_user ||= Current.user! }

  def self.search_fields
    from_user_table = User.arel_table.alias(:from_users)
    to_user_table = User.arel_table.alias(:to_users)

    {
      "from_user:id": {
        node: -> { from_user_table[:id] },
        relation: ->(scope) { scope.left_joins_from_users },
        type: :integer
      },
      "from_user:description": {
        node: -> { from_user_table[:description] },
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
      "to_user:description": {
        node: -> { to_user_table[:description] },
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

  def subject_sample
    Truncate.strip(subject&.to_plain_text)
  end

  def body_sample
    Truncate.strip(body&.to_plain_text)
  end

  def from_user_sample
    Truncate.strip(from_user)
  end

  def to_user_sample
    Truncate.strip(to_user)
  end

  def to_s
    Utils.join(
      subject_sample.presence || body_sample.presence ||
        from_user_sample.presence || to_user_sample,
      id_sample
    ).presence || t("to_s", id:)
  end

  def to_code
    Code::Object::Message.new(id: id)
  end
end
