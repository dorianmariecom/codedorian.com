# frozen_string_literal: true

class Configuration < ApplicationRecord
  validates :name, uniqueness: true, presence: true
  validates :content, presence: true

  validate(:parse_and_validate_content, on: :controller)

  def self.search_fields
    {
      name: {
        node: -> { arel_table[:name] },
        type: :string
      },
      content: {
        node: -> { arel_table[:content] },
        type: :string
      },
      **base_search_fields
    }
  end

  def parse_and_validate_content
    self.content = JSON.parse(content.to_s)
  rescue JSON::ParserError
    errors.add(:content, t("invalid_json"))
  end

  def name_sample
    Truncate.strip(name)
  end

  def content_sample
    Truncate.strip(content.to_json)
  end

  def content_json
    JSON.pretty_generate(content)
  end

  def to_param
    name
  end

  def to_s
    name_sample.presence || content_sample.presence || t("to_s", id: id)
  end
end
