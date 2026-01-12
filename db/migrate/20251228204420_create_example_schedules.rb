# frozen_string_literal: true

class CreateExampleSchedules < ActiveRecord::Migration[8.1]
  def change
    create_table(:example_schedules) do |t|
      t.references(:example, null: false, foreign_key: true)
      t.string(:interval)
      t.datetime(:starts_at)

      t.timestamps
    end
  end
end
