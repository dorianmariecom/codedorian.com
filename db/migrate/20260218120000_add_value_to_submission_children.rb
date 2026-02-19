# frozen_string_literal: true

class AddValueToSubmissionChildren < ActiveRecord::Migration[7.1]
  def change
    add_column(:submission_programs, :value, :text)
    add_column(:submission_schedules, :value, :text)
    add_column(:submission_deliveries, :value, :text)
  end
end
