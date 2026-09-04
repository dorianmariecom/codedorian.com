# frozen_string_literal: true

class AddLatestIndexToProgramExecutions < ActiveRecord::Migration[8.1]
  disable_ddl_transaction!

  def change
    add_index(
      :program_executions,
      %i[program_id created_at id],
      order: { created_at: :desc, id: :desc },
      name: :index_program_executions_on_program_latest,
      algorithm: :concurrently
    )
  end
end
