# frozen_string_literal: true

class AddUpdatedAtToRemainingTables < ActiveRecord::Migration[8.1]
  def up
    add_column :blazer_audits,
               :updated_at,
               :datetime,
               null: false,
               default: -> { "CURRENT_TIMESTAMP" }
    add_column :solid_cable_messages,
               :updated_at,
               :datetime,
               null: false,
               default: -> { "CURRENT_TIMESTAMP" }
    add_column :solid_cache_entries,
               :updated_at,
               :datetime,
               null: false,
               default: -> { "CURRENT_TIMESTAMP" }

    execute "UPDATE blazer_audits SET updated_at = COALESCE(created_at, updated_at)"
    execute "UPDATE solid_cable_messages SET updated_at = created_at"
    execute "UPDATE solid_cache_entries SET updated_at = created_at"
  end

  def down
    remove_column :solid_cache_entries, :updated_at
    remove_column :solid_cable_messages, :updated_at
    remove_column :blazer_audits, :updated_at
  end
end
