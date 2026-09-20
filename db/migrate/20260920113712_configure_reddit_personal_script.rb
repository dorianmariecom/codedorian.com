# frozen_string_literal: true

class ConfigureRedditPersonalScript < ActiveRecord::Migration[8.1]
  def up
    execute <<~SQL.squish
      UPDATE delivery_channels
      SET "only" = 'private', show_connection = FALSE, show_visibility = FALSE,
          show_recipient = TRUE, delivery_connection_id = NULL,
          private_pattern = '(?:u/|@)?[a-zA-Z0-9_-]{3,20}'
      WHERE key = 'reddit'
    SQL
    execute <<~SQL.squish
      UPDATE delivery_destinations
      SET recipient_verified = FALSE, delivery_connection_id = NULL,
          enabled = CASE WHEN visibility = 'public' THEN FALSE ELSE enabled END,
          visibility = 'private',
          recipient = LOWER(REGEXP_REPLACE(BTRIM(recipient), '^(u/|@)', '')),
          updated_at = CURRENT_TIMESTAMP
      WHERE delivery_channel_id IN (SELECT id FROM delivery_channels WHERE key = 'reddit')
    SQL
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
