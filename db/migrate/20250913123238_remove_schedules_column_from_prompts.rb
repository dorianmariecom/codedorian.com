# frozen_string_literal: true

class RemoveSchedulesColumnFromPrompts < ActiveRecord::Migration[8.0]
  def change
    remove_column :prompts, :schedules, :jsonb
  end
end
