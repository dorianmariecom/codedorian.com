# frozen_string_literal: true

class CreateExamples < ActiveRecord::Migration[8.1]
  def change
    create_table(:examples) do |t|
      t.string(:name)
      t.text(:input)
      t.bigint(:position, default: 0, null: false)

      t.timestamps
    end
  end
end
