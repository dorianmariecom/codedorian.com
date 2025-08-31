# frozen_string_literal: true

class Datum < ApplicationRecord
  KEY_SAMPLE_SIZE = 140
  VALUE_SAMPLE_SIZE = 140
  OMISSION = "…"

  belongs_to :user, default: -> { Current.user! }, touch: true

  before_validation { self.user ||= Current.user! }

  validate { can!(:update, user) }
  validate :parse_and_validate_key, on: :controller
  validate :parse_and_validate_value, on: :controller

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
    key.to_json.truncate(KEY_SAMPLE_SIZE, omission: OMISSION).presence
  end

  def value_sample
    value.to_json.truncate(VALUE_SAMPLE_SIZE, omission: OMISSION).presence
  end

  def to_code
    Code::Object::Datum.new(id: id, key: key, value: value)
  end

  def to_s
    key_sample.presence || value_sample || t("to_s", id: id)
  end
end
