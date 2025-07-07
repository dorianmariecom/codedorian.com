# frozen_string_literal: true

class Datum < ApplicationRecord
  KEY_SAMPLE_SIZE = 140
  VALUE_SAMPLE_SIZE = 140
  OMISSION = "…"

  belongs_to :user, default: -> { Current.user! }, touch: true

  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }

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

  def key_sample
    key.to_s.truncate(KEY_SAMPLE_SIZE, omission: OMISSION).presence
  end

  def value_sample
    value.to_s.truncate(VALUE_SAMPLE_SIZE, omission: OMISSION).presence
  end

  def to_code
    Code::Object::Datum.new(id: id, key: key, value: value)
  end

  def to_s
    key_sample.presence || value_sample || t("to_s", id: id)
  end
end
