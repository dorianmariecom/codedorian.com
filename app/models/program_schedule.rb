# frozen_string_literal: true

class ProgramSchedule < ApplicationRecord
  include(ScheduleConcern)

  belongs_to(:program, touch: true)
  has_one(:user, through: :program)

  scope(:where_user, ->(user) { joins(:user).where(users: { id: user }) })
  scope(:where_program, ->(program) { where(program: program) })

  validate { can!(:update, program) }

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

  def to_code
    Code::Object::Schedule.new(
      id: id,
      starts_at: starts_at,
      interval: interval,
      translated_interval: translated_interval,
      next_at: next_at
    )
  end

  def to_s
    translated_interval.presence || t("to_s", id: id)
  end
end
