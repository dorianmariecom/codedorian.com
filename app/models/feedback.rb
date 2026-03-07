# frozen_string_literal: true

class Feedback < ApplicationRecord
  belongs_to(:user, optional: true, touch: true)
  belongs_to(:guest, optional: true, touch: true)

  def self.search_fields
    {
      message: {
        node: -> { arel_table[:message] },
        type: :string
      },
      locale: {
        node: -> { arel_table[:locale] },
        type: :string
      },
      path: {
        node: -> { arel_table[:path] },
        type: :string
      },
      ip: {
        node: -> { arel_table[:ip] },
        type: :string
      },
      user_agent: {
        node: -> { arel_table[:user_agent] },
        type: :string
      },
      **base_search_fields
    }
  end

  def to_s
    message_sample.presence || t("to_s", id: id)
  end

  def message_sample
    Truncate.strip(message)
  end
end
