# frozen_string_literal: true

class Datum < ApplicationRecord
  belongs_to(:user, default: -> { Current.user! }, touch: true)

  scope(:where_user, ->(user) { where(user: user) })

  before_validation { self.user ||= Current.user! }

  validate { can!(:update, user) }
  validate(:parse_and_validate_key, on: :controller)
  validate(:parse_and_validate_value, on: :controller)

  def self.search_fields
    {
      key: {
        node: -> { arel_table[:key] },
        type: :string
      },
      value: {
        node: -> { arel_table[:value] },
        type: :string
      },
      **base_search_fields,
      **User.associated_search_fields
    }
  end

  def parse_and_validate_key
    self.key = JSON.parse(key.to_s)
  rescue JSON::ParserError
    errors.add(:key, t("invalid_json"))
  end

  def parse_and_validate_value
    self.value = JSON.parse(value.to_s)
  rescue JSON::ParserError
    errors.add(:value, t("invalid_json"))
  end

  def key_sample
    Truncate.strip(key.to_json)
  end

  def value_sample
    Truncate.strip(value.to_json)
  end

  def to_code
    Code::Object::Datum.new(id: id, key: key, value: value)
  end

  def key_json
    JSON.pretty_generate(key)
  end

  def value_json
    JSON.pretty_generate(value)
  end

  def to_s
    key_sample.presence || value_sample.presence || t("to_s", id: id)
  end
end
