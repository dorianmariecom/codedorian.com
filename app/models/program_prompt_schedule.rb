# frozen_string_literal: true

class ProgramPromptSchedule < ApplicationRecord
  include(ScheduleConcern)

  belongs_to(:program_prompt, touch: true)
  has_one(:program, through: :program_prompt)
  has_one(:user, through: :program_prompt)

  scope(:where_user, ->(user) { joins(:user).where(users: { id: user }) })
  scope(
    :where_program,
    ->(program) { joins(:program).where(programs: { id: program }) }
  )
  scope(
    :where_program_prompt,
    ->(program_prompt) { where(program_prompt: program_prompt) }
  )

  validate { can!(:update, program_prompt) }

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
    t("to_s", id: id)
  end
end
