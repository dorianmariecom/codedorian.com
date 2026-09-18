# frozen_string_literal: true

class EnableWebhookDelivery < ActiveRecord::Migration[8.1]
  def up
    execute <<~SQL.squish
      INSERT INTO delivery_channels
        (key, enabled, amount_cents, amount_currency, show_recipient, show_visibility, created_at, updated_at)
      VALUES ('webhook', TRUE, 0, 'eur', TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET enabled = TRUE, amount_cents = 0, amount_currency = 'eur',
          show_recipient = TRUE, show_visibility = FALSE, updated_at = CURRENT_TIMESTAMP
    SQL
  end

  def down
    execute <<~SQL.squish
      UPDATE delivery_channels SET enabled = FALSE, amount_cents = NULL,
        updated_at = CURRENT_TIMESTAMP WHERE key = 'webhook'
    SQL
  end
end
