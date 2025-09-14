# frozen_string_literal: true

class MoveJsonbSchedulesOfPromptsToActualSchedules < ActiveRecord::Migration[
  8.0
]
  disable_ddl_transaction!

  def up
    ::Current.with(user: User.new(admin: true)) do
      Prompt.find_each do |prompt|
        (prompt[:schedules].presence || []).each do |schedule|
          Schedule.create!(
            schedulable: prompt,
            interval: schedule["interval"],
            starts_at: schedule["starts_at"]
          )
        end
      end
    end
  end

  def down
    Schedule.where(schedulable_type: "Prompt").destroy_all
  end
end
