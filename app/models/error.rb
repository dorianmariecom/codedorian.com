# frozen_string_literal: true

class Error < SolidErrors::Error
  include Search

  MESSAGE_LIMIT = 140
  OMISSION = "…"

  def self.search_fields
    {
      id: {
        node: -> { arel_table[:id] },
        type: :integer
      },
      exception_class: {
        node: -> { arel_table[:exception_class] },
        type: :string
      },
      fingerprint: {
        node: -> { arel_table[:fingerprint] },
        type: :string
      },
      message: {
        node: -> { arel_table[:message] },
        type: :string
      },
      severity: {
        node: -> { arel_table[:severity] },
        type: :string
      },
      source: {
        node: -> { arel_table[:source] },
        type: :string
      },
      resolved_at: {
        node: -> { arel_table[:resolved_at] },
        type: :datetime
      },
      updated_at: {
        node: -> { arel_table[:updated_at] },
        type: :datetime
      },
      created_at: {
        node: -> { arel_table[:created_at] },
        type: :datetime
      }
    }
  end

  def to_s
    "#{exception_class}: #{message}".truncate(MESSAGE_LIMIT, omission: OMISSION)
  end
end
