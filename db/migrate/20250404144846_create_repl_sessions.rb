# frozen_string_literal: true

class CreateReplSessions < ActiveRecord::Migration[8.1]
  def change
    create_table :repl_sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
