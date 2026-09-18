# frozen_string_literal: true

class UnifyDeliveryConfiguration < ActiveRecord::Migration[8.0]
  def up
    add_column :delivery_channels, :only, :string
    add_column :delivery_channels, :public_pattern, :string
    add_column :delivery_channels, :private_pattern, :string
    add_column :delivery_channels, :show_connection, :boolean, default: false, null: false

    execute <<~SQL.squish
      UPDATE delivery_channels SET "only" = 'private';
      UPDATE delivery_channels SET "only" = NULL WHERE key IN ('x', 'mastodon');
      UPDATE delivery_channels SET "only" = CASE WHEN private_delivery_enabled THEN NULL ELSE 'public' END WHERE key = 'reddit';
      UPDATE delivery_channels SET "only" = 'public', show_recipient = false WHERE key = 'facebook';
      UPDATE delivery_channels SET show_connection = true WHERE key IN ('slack', 'x', 'mastodon', 'reddit');
    SQL
    patterns = {
      "slack" => ['(?:[@#][^\\s@#<>]+|[CGDUW][A-Z0-9]+)', '(?:[@#][^\\s@#<>]+|[CGDUW][A-Z0-9]+)'],
      "x" => ['(@[a-zA-Z0-9_]{1,15}|#[\\p{L}\\p{N}_]+)?', '@[a-zA-Z0-9_]{1,15}'],
      "reddit" => ['(?:r/|#)[a-zA-Z0-9_]{2,21}', '(?:u/|@)[a-zA-Z0-9_\\-]{3,20}'],
      "mastodon" => ['.*', '.+'],
      "facebook" => ['(?:)', '(?:)'],
      "messenger" => ['[0-9]+', '[0-9]+'],
      "instagram" => ['[0-9]+', '[0-9]+'],
      "telegram" => ['-?[0-9]+', '-?[0-9]+'],
      "viber" => ['\\S+', '\\S+']
    }
    patterns.each do |key, (public_pattern, private_pattern)|
      execute "UPDATE delivery_channels SET public_pattern = #{connection.quote(public_pattern)}, private_pattern = #{connection.quote(private_pattern)} WHERE key = #{connection.quote(key)}"
    end
    remove_column :delivery_channels, :private_delivery_enabled, :boolean
    # Destinations and deliveries already contain the resolved Messenger recipient.
    remove_reference :deliveries, :facebook_account, foreign_key: true
    remove_reference :delivery_destinations, :facebook_account, foreign_key: true
    drop_table :facebook_accounts
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
