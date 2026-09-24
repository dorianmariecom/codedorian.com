# frozen_string_literal: true

class AddIdentityToDeliveryConnections < ActiveRecord::Migration[8.1]
  def up
    add_column :delivery_connections, :email, :string
    add_column :delivery_connections, :username, :string
    add_column :delivery_connections, :external_id, :string
    execute <<~SQL.squish
      UPDATE delivery_connections
      SET external_id = NULLIF(sender, '')
      WHERE provider IN ('google', 'github', 'slack', 'x', 'mastodon', 'facebook', 'gmail', 'google_workspace', 'outlook')
    SQL
    execute <<~SQL.squish
      UPDATE delivery_connections
      SET email = NULLIF(smtp_from, '')
      WHERE smtp_from ~ '^[^[:space:]<>@]+@[^[:space:]<>@]+$'
    SQL
    execute <<~SQL.squish
      UPDATE delivery_connections
      SET username = description
      WHERE provider = 'github' AND description ~ '^[a-zA-Z0-9-]+$'
    SQL
    execute <<~SQL.squish
      UPDATE delivery_connections
      SET username = SUBSTRING(description FROM 2)
      WHERE provider = 'x' AND description ~ '^@[a-zA-Z0-9_]+$'
    SQL
    execute <<~SQL.squish
      UPDATE delivery_connections
      SET username = SPLIT_PART(description, '@', 2)
      WHERE provider = 'mastodon' AND description ~ '^@[^[:space:]@]+@[^[:space:]@]+$'
    SQL
    execute <<~SQL.squish
      UPDATE delivery_connections
      SET username = NULLIF(smtp_user_name, '')
      WHERE provider = 'smtp'
    SQL
    remove_column :delivery_connections, :description
  end

  def down
    add_column :delivery_connections, :description, :text
    execute <<~SQL.squish
      UPDATE delivery_connections
      SET description = NULLIF(CONCAT_WS(' - ', email, username, external_id), '')
    SQL
    remove_column :delivery_connections, :email
    remove_column :delivery_connections, :username
    remove_column :delivery_connections, :external_id
  end
end
