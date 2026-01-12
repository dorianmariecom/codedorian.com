# frozen_string_literal: true

class Session < ActiveRecord::SessionStore::Session
  include(RecordConcern)

  %i[user guest].each do |model|
    scope(
      :"where_#{model}",
      ->(record) { where("data ->> '#{model}_id' = ?", record) }
    )
  end

  validate(:parse_and_validate_data, on: :controller)

  def self.search_fields
    {
      session_id: {
        node: -> { arel_table[:session_id] },
        type: :string
      },
      data: {
        node: -> { arel_table[:data] },
        type: :string
      },
      **base_search_fields
    }
  end

  def user_id
    data&.fetch("user_id", nil)
  end

  def guest_id
    data&.fetch("guest_id", nil)
  end

  def user
    User.find_by(id: user_id)
  end

  def guest
    Guest.find_by(id: guest_id)
  end

  def session_id_sample
    Truncate.strip(session_id)
  end

  def user_id_sample
    Truncate.strip(user_id)
  end

  def guest_id_sample
    Truncate.strip(guest_id)
  end

  def data_json
    JSON.pretty_generate(data)
  end

  def data_sample
    Truncate.strip(data.to_json)
  end

  def parse_and_validate_data
    self.data = JSON.parse(data.to_s)
  rescue JSON::ParserError
    errors.add(:data, t("invalid_json"))
  end

  def to_s
    data_sample.presence || session_id_sample.presence || user_id_sample.presence ||
      guest_id_sample.presence || t("to_s", id: id)
  end
end
