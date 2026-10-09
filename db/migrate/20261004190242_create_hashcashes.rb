# frozen_string_literal: true

class CreateHashcashes < ActiveRecord::Migration[8.1]
  def change
    create_table :hashcashes do |t|
      t.string :challenge_id, null: false
      t.datetime :expires_at, null: false

      t.timestamps
    end
    add_index :hashcashes, :challenge_id, unique: true
    add_index :hashcashes, :expires_at
  end
end
