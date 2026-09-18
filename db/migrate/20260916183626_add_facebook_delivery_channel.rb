# frozen_string_literal: true

class AddFacebookDeliveryChannel < ActiveRecord::Migration[8.1]
  def up
    execute <<~SQL.squish
      INSERT INTO delivery_channels
        (key, enabled, amount_currency, show_recipient, show_visibility, created_at, updated_at)
      VALUES ('facebook', FALSE, 'eur', FALSE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO NOTHING
    SQL
  end

  def down
    execute <<~SQL.squish
      UPDATE delivery_channels SET enabled = FALSE,
        updated_at = CURRENT_TIMESTAMP WHERE key = 'facebook'
    SQL
  end
end
