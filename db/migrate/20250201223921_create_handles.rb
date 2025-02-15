# frozen_string_literal: true

class CreateHandles < ActiveRecord::Migration[8.1]
  def change
    create_table :handles do |t|
      t.references :user, null: false, foreign_key: true
      t.boolean :verified, null: false, default: false
      t.boolean :primary, null: false, default: false
      t.string :handle

      t.timestamps
    end
  end
end
