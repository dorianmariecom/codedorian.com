# frozen_string_literal: true

class RemovePromptSchedulables < ActiveRecord::Migration[8.0]
  def change
    Schedule.where(schedulable_type: "Prompt").delete_all

    remove_column :schedules, :schedulable_type, :string
    rename_column :schedules, :schedulable_id, :program_id
  end
end
