# frozen_string_literal: true

class RemoveNameFromDeliveryConnections < ActiveRecord::Migration[8.1]
  def up
    execute <<~SQL.squish
      UPDATE delivery_connections
      SET description = CASE
        WHEN description IS NULL OR description = '' OR description = name THEN name
        WHEN name IS NULL OR name = '' THEN description
        ELSE name || ' - ' || description
      END
    SQL
    remove_column :delivery_connections, :name
  end

  def down
    add_column :delivery_connections, :name, :string
    execute "UPDATE delivery_connections SET name = COALESCE(description, '')"
    change_column_null :delivery_connections, :name, false
  end
end
