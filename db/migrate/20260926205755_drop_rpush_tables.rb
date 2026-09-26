# frozen_string_literal: true

class DropRpushTables < ActiveRecord::Migration[8.1]
  def up
    drop_table :rpush_notifications
    drop_table :rpush_feedback
    drop_table :rpush_apps
  end

  def down
    raise ActiveRecord::IrreversibleMigration,
          "Restore the Rpush tables from the pre-deployment backup"
  end
end
