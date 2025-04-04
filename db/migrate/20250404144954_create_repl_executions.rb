# frozen_string_literal: true

class CreateReplExecutions < ActiveRecord::Migration[8.1]
  def change
    create_table :repl_executions do |t|
      t.references :repl_program, null: false, foreign_key: true

      t.text :input
      t.text :error
      t.text :output
      t.text :result
      t.text :context

      t.timestamps
    end
  end
end
