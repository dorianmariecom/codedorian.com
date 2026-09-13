# frozen_string_literal: true

class NormalizeDeliveryAttributes < ActiveRecord::Migration[8.0]
  class Connection < ActiveRecord::Base
    self.table_name = "delivery_connections"
    encrypts :access_token, :auth_token, :api_key, :smtp_password
  end

  def up
    add_column :deliveries, :subject, :text
    add_column :deliveries, :body_text, :text
    add_column :deliveries, :body_html, :text
    add_column :deliveries, :url, :text
    add_column :deliveries, :locale, :string
    add_column :deliveries, :channel, :string
    add_column :deliveries, :recipient, :text
    add_column :deliveries, :visibility, :string
    add_column :deliveries, :connection_id, :bigint
    add_column :deliveries, :event_key_digest, :string
    add_column :delivery_channels, :messaging_service_sid, :string
    add_column :delivery_channels, :content_sid_en, :string
    add_column :delivery_channels, :content_sid_fr, :string
    add_column :delivery_channels, :callback_base_url, :string
    add_column :delivery_channels,
               :private_delivery_enabled,
               :boolean,
               default: false,
               null: false
    add_column :delivery_connections, :access_token, :text
    add_column :delivery_connections, :base_url, :text
    add_column :delivery_connections, :account_sid, :text
    add_column :delivery_connections, :auth_token, :text
    add_column :delivery_connections, :api_key, :text
    add_column :delivery_connections, :sender, :text
    add_column :delivery_connections, :smtp_from, :text
    add_column :delivery_connections, :smtp_address, :text
    add_column :delivery_connections, :smtp_user_name, :text
    add_column :delivery_connections, :smtp_password, :text
    add_column :delivery_connections, :smtp_authentication, :text
    add_column :delivery_connections, :smtp_port, :integer
    add_column :subscriptions, :delivery_base_amount_cents, :integer
    add_column :subscriptions, :delivery_amount_cents, :integer
    add_column :subscriptions, :delivery_amount_currency, :string
    add_column :subscription_destinations, :name, :string

    execute <<~SQL.squish
      UPDATE deliveries SET
        subject = payload->>'subject', body_text = payload->>'body_text',
        body_html = payload->>'body_html', url = payload->>'url',
        locale = COALESCE(payload->>'locale', 'en'),
        channel = destination_snapshot->>'channel',
        recipient = destination_snapshot->>'recipient',
        visibility = destination_snapshot->>'visibility',
        connection_id = (destination_snapshot->>'connection_id')::bigint,
        event_key_digest = CASE
          WHEN event_key ~ '^sha256:[a-f0-9]{64}$' THEN substring(event_key FROM 8)
          ELSE encode(sha256(convert_to(event_key, 'UTF8')), 'hex')
        END
    SQL
    execute <<~SQL.squish
      UPDATE delivery_channels SET
        messaging_service_sid = settings->>'messaging_service_sid',
        content_sid_en = settings->>'content_sid_en',
        content_sid_fr = settings->>'content_sid_fr',
        callback_base_url = settings->>'callback_base_url',
        private_delivery_enabled = COALESCE((settings->>'private_delivery_enabled')::boolean, false)
    SQL
    execute <<~SQL.squish
      UPDATE subscriptions SET
        delivery_base_amount_cents = (delivery_pricing->>'base_amount_cents')::integer,
        delivery_amount_cents = (delivery_pricing->>'amount_cents')::integer,
        delivery_amount_currency = delivery_pricing->>'amount_currency'
    SQL
    execute <<~SQL.squish
      UPDATE subscription_destinations SET name = COALESCE(
        (SELECT item->>'name' FROM subscriptions,
          jsonb_array_elements(delivery_pricing->'items') item
          WHERE subscriptions.id = subscription_destinations.subscription_id
            AND (item->>'destination_id')::bigint = subscription_destinations.delivery_destination_id
          LIMIT 1),
        (SELECT name FROM delivery_destinations WHERE id = subscription_destinations.delivery_destination_id)
      )
    SQL

    # The old key is used only to read legacy ciphertext during this migration.
    key =
      Rails.application.key_generator.generate_key(
        "delivery-connections-v1",
        32
      )
    encryptor = ActiveSupport::MessageEncryptor.new(key, cipher: "aes-256-gcm")
    Connection.reset_column_information
    Connection.find_each do |connection|
      next if connection.encrypted_credentials.blank?

      credentials =
        JSON.parse(
          encryptor.decrypt_and_verify(connection.encrypted_credentials)
        )
      smtp = credentials.fetch("smtp_settings", {})
      connection.update!(
        access_token: credentials["access_token"],
        base_url: credentials["base_url"],
        account_sid: credentials["account_sid"],
        auth_token: credentials["auth_token"],
        api_key: credentials["api_key"],
        sender: credentials["sender"],
        smtp_from: credentials["from"],
        smtp_address: smtp["address"],
        smtp_port: smtp["port"],
        smtp_user_name: smtp["user_name"],
        smtp_password: smtp["password"],
        smtp_authentication: smtp["authentication"]
      )
    end

    remove_index :deliveries, name: :index_delivery_event_destination_uniqueness
    change_column :deliveries, :event_key, :text
    change_column_null :deliveries, :event_key_digest, false
    add_index :deliveries,
              %i[subscription_id event_key_digest delivery_destination_id],
              unique: true,
              name: :index_delivery_event_destination_uniqueness
    add_index :deliveries, :connection_id
    remove_column :deliveries, :payload
    remove_column :deliveries, :destination_snapshot
    remove_column :delivery_channels, :settings
    remove_column :delivery_connections, :encrypted_credentials
    remove_column :delivery_destinations, :settings
    remove_column :subscriptions, :delivery_pricing
  end

  def down
    raise ActiveRecord::IrreversibleMigration,
          "Delivery data has been normalized and credentials re-encrypted"
  end
end
