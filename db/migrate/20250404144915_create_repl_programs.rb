# frozen_string_literal: true

class CreateReplPrograms < ActiveRecord::Migration[8.1]
  def change
    create_table :repl_programs do |t|
      t.references :repl_session, null: false, foreign_key: true
      t.text :input

      t.timestamps
    end
  end
end
