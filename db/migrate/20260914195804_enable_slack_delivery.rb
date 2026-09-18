# frozen_string_literal: true

class EnableSlackDelivery < ActiveRecord::Migration[8.1]
  def up
    execute <<~SQL.squish
      INSERT INTO delivery_channels
        (key, enabled, amount_cents, amount_currency, show_recipient, created_at, updated_at)
      VALUES
        ('slack', TRUE, 0, 'eur', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE
      SET enabled = TRUE,
          amount_cents = 0,
          amount_currency = 'eur',
          show_recipient = TRUE,
          updated_at = CURRENT_TIMESTAMP
    SQL
  end

  def down
    execute <<~SQL.squish
      UPDATE delivery_channels
      SET enabled = FALSE, amount_cents = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE key = 'slack'
    SQL
  end
end
