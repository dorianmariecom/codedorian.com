# frozen_string_literal: true

class ExampleSchedule < ApplicationRecord
  include(ScheduleConcern)

  belongs_to(:example, touch: true)

  scope(:where_example, ->(example) { where(example: example) })

  validate { can!(:update, example) }

  def self.search_fields
    {
      starts_at: {
        node: -> { arel_table[:starts_at] },
        type: :datetime
      },
      interval: {
        node: -> { arel_table[:interval] },
        type: :string
      },
      **base_search_fields
    }
  end

  def to_s
    translated_interval.presence || t("to_s", id: id)
  end
end
