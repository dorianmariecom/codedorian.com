# frozen_string_literal: true

class RenameDeliveryConnectionsToConnections < ActiveRecord::Migration[8.1]
  def up
    rename_table :delivery_connections, :connections
    rename_column :delivery_channels, :delivery_connection_id, :connection_id
    rename_column :delivery_destinations,
                  :delivery_connection_id,
                  :connection_id
    rename_references(
      "DeliveryConnection",
      "Connection",
      "delivery_connection",
      "connection"
    )
  end

  def down
    rename_references(
      "Connection",
      "DeliveryConnection",
      "connection",
      "delivery_connection"
    )
    rename_column :delivery_destinations,
                  :connection_id,
                  :delivery_connection_id
    rename_column :delivery_channels, :connection_id, :delivery_connection_id
    rename_table :connections, :delivery_connections
  end

  private

  def rename_references(old_type, new_type, old_key, new_key)
    execute <<~SQL.squish
      UPDATE versions SET item_type = '#{new_type}' WHERE item_type = '#{old_type}'
    SQL
    %w[object object_changes].each { |column| execute <<~SQL.squish }
        UPDATE versions
        SET #{column} = (#{column} - '#{old_key}_id') ||
          jsonb_build_object('#{new_key}_id', #{column}->'#{old_key}_id')
        WHERE item_type IN ('DeliveryChannel', 'DeliveryDestination')
          AND #{column} ? '#{old_key}_id'
      SQL
    resources = %w[delivery_channel delivery_destination]
    %w[logs job_contexts solid_errors_occurrences].each do |table|
      execute <<~SQL.squish
        UPDATE #{table}
        SET context = (context - '#{old_key}') ||
          jsonb_build_object('#{new_key}', context->'#{old_key}')
        WHERE context ? '#{old_key}'
      SQL
      resources.each { |resource| execute <<~SQL.squish }
          UPDATE #{table}
          SET context = jsonb_set(context, '{#{resource}}',
            ((context->'#{resource}') - '#{old_key}_id') ||
            jsonb_build_object('#{new_key}_id', context->'#{resource}'->'#{old_key}_id'))
          WHERE context->'#{resource}' ? '#{old_key}_id'
        SQL
    end
  end
end
