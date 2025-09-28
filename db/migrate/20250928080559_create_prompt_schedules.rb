# frozen_string_literal: true

class CreatePromptSchedules < ActiveRecord::Migration[8.0]
  def change
    create_table :prompt_schedules do |t|
      t.references :prompt, null: false, foreign_key: true
      t.datetime :starts_at
      t.string :interval

      t.timestamps
    end
  end
end
