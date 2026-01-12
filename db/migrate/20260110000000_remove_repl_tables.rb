# frozen_string_literal: true

class RemoveReplTables < ActiveRecord::Migration[7.1]
  def up
    remove_reference(:messages, :repl_program, index: true)

    drop_table(:repl_executions)
    drop_table(:repl_prompts)
    drop_table(:repl_programs)
    drop_table(:repl_sessions)
  end

  def down
    raise(ActiveRecord::IrreversibleMigration)
  end
end
