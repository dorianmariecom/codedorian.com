# frozen_string_literal: true

class CreateData < ActiveRecord::Migration[8.1]
  def change
    create_table :data do |t|
      t.references :user, null: false, foreign_key: true
      t.jsonb :key
      t.jsonb :value

      t.timestamps
    end
  end
end
