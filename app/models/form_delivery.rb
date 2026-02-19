# frozen_string_literal: true

class FormDelivery < ApplicationRecord
  validate { can!(:update, :form_delivery) }
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

  def description_sample
    Truncate.strip(description)
  end

  def name_sample
    Truncate.strip(name)
  end

  def to_s
    name_sample.presence || description_sample.presence || t("to_s", id: id)
  end
end
