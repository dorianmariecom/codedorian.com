# frozen_string_literal: true

class CreateConfigurations < ActiveRecord::Migration[8.1]
  def change
    create_table :configurations do |t|
      t.string :name, null: false
      t.jsonb :content, null: false, default: {}

      t.timestamps

      t.index :name, unique: true
    end
  end
end
