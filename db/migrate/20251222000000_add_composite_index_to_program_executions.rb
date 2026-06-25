# frozen_string_literal: true

class AddCompositeIndexToProgramExecutions < ActiveRecord::Migration[8.1]
  def change
    add_index :program_executions,
              [:program_id, :created_at],
              order: { created_at: :desc },
              name: "index_program_executions_on_program_id_and_created_at"
  end
end