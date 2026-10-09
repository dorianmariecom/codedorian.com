# frozen_string_literal: true

class RemoveBlazer < ActiveRecord::Migration[8.1]
  def up
    drop_table :blazer_dashboard_queries
    drop_table :blazer_checks
    drop_table :blazer_audits
    drop_table :blazer_dashboards
    drop_table :blazer_queries
  end

  def down
    raise ActiveRecord::IrreversibleMigration,
          "Restore the Blazer tables from the pre-deployment backup"
  end
end
