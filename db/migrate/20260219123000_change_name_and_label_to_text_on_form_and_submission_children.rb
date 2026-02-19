# frozen_string_literal: true

class ChangeNameAndLabelToTextOnFormAndSubmissionChildren < ActiveRecord::Migration[
  8.1
]
  TABLES = %i[
    form_programs
    form_schedules
    form_deliveries
    submission_programs
    submission_schedules
    submission_deliveries
  ].freeze

  def up
    TABLES.each do |table|
      change_column(table, :name, :text)
      change_column(table, :label, :text)
    end
  end

  def down
    TABLES.each do |table|
      change_column(table, :name, :string)
      change_column(table, :label, :string)
    end
  end
end
