# frozen_string_literal: true

class RenameTables < ActiveRecord::Migration[8.0]
  def change
    rename_table :prompts, :program_prompts
    rename_table :schedules, :program_schedules
    rename_table :prompt_schedules, :program_prompt_schedules
    rename_column :program_prompt_schedules, :prompt_id, :program_prompt_id
  end
end
