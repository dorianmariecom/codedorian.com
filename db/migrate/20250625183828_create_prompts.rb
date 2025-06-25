# frozen_string_literal: true

class CreatePrompts < ActiveRecord::Migration[8.1]
  def change
    create_table :prompts do |t|
      t.references :user, foreign_key: true
      t.references :program, polymorphic: true
      t.text :input
      t.jsonb :output

      t.timestamps
    end
  end
end
