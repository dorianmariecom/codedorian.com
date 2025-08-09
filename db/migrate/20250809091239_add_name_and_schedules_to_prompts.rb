# frozen_string_literal: true

class AddNameAndSchedulesToPrompts < ActiveRecord::Migration[8.0]
  def change
    change_table :prompts, bulk: true do
      add_column :prompts, :name, :text
      add_column :prompts, :schedules, :jsonb
    end
  end
end
