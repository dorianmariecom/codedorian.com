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
    Code::Object::ProgramSchedule.new(
      id: id,
      created_at: created_at,
      interval: interval,
      program_id: program_id,
      starts_at: starts_at,
      updated_at: updated_at
    )
  end

  def translated_interval_sample
    Truncate.strip(translated_interval)
  end

  def program_sample
    Truncate.strip(program)
  end

  def to_s
    Utils.join(
      translated_interval_sample.presence || program_sample,
      id_sample
    ).presence || t("to_s", id:)
  end
end
