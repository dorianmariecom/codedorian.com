# frozen_string_literal: true

class FormSchedule < ApplicationRecord
  validate { can!(:update, self) }
  validates(:locale, inclusion: { in: LOCALES_STRINGS })

  def self.search_fields
    {
      locale: {
        node: -> { arel_table[:locale] },
        type: :string
      },
      name: {
        node: -> { arel_table[:name] },
        type: :string
      },
      label: {
        node: -> { arel_table[:label] },
        type: :string
      },
      description: {
        node: -> { arel_table[:description] },
        type: :string
      },
      position: {
        node: -> { arel_table[:position] },
        type: :integer
      },
      **base_search_fields
    }
  end

  def name_sample
    Truncate.strip(name)
  end

  def description_sample
    Truncate.strip(description)
  end

  def to_s
    name_sample.presence || description_sample.presence || t("to_s", id: id)
  end
end
