# frozen_string_literal: true

class MoveJsonbSchedulesOfPromptsToActualSchedules < ActiveRecord::Migration[
  8.0
]
  disable_ddl_transaction!

  def up
    ::Current.with(user: User.new(admin: true)) do
      schedules =
        Prompt.all.flat_map do |prompt|
          (prompt[:schedules].presence || []).map do |schedule|
            {
              schedulable_type: "Prompt",
              schedulable_id: prompt.id,
              interval: schedule["interval"],
              starts_at: schedule["starts_at"]
            }
          end
        end

      Schedule.insert_all(schedules)
    end
  end

  def down
    Schedule.where(schedulable_type: "Prompt").destroy_all
  end
end
