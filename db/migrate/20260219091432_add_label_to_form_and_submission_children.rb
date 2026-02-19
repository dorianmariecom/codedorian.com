# frozen_string_literal: true

class AddLabelToFormAndSubmissionChildren < ActiveRecord::Migration[8.1]
  def change
    add_column(:form_programs, :label, :string)
    add_column(:form_schedules, :label, :string)
    add_column(:form_deliveries, :label, :string)
    add_column(:submission_programs, :label, :string)
    add_column(:submission_schedules, :label, :string)
    add_column(:submission_deliveries, :label, :string)
  end
end
