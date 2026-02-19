# frozen_string_literal: true

class RemoveStartsAtAndIntervalFromFormAndSubmissionSchedules < ActiveRecord::Migration[
  8.0
]
  def change
    remove_column(:form_schedules, :starts_at, :datetime, if_exists: true)
    remove_column(:form_schedules, :interval, :string, if_exists: true)

    remove_column(:submission_schedules, :starts_at, :datetime, if_exists: true)
    remove_column(:submission_schedules, :interval, :string, if_exists: true)
  end
end
