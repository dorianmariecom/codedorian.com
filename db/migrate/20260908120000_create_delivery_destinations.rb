# frozen_string_literal: true

class CreateDeliveryDestinations < ActiveRecord::Migration[8.0]
  def change
    create_table :delivery_connections do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :provider, null: false
      t.text :encrypted_credentials
      t.boolean :enabled, null: false, default: true
      t.timestamps
    end
    create_table :delivery_channels do |t|
      t.string :key, null: false
      t.boolean :enabled, null: false, default: false
      t.integer :amount_cents
      t.string :amount_currency, null: false, default: "eur"
      t.references :delivery_connection, foreign_key: true
      t.jsonb :settings, null: false, default: {}
      t.timestamps
    end
    add_index :delivery_channels, :key, unique: true
    create_table :delivery_destinations do |t|
      t.references :user, null: false, foreign_key: true
      t.references :delivery_channel, null: false, foreign_key: true
      t.references :delivery_connection, foreign_key: true
      t.string :name, null: false
      t.string :recipient
      t.string :visibility, null: false, default: "private"
      t.boolean :enabled, null: false, default: true
      t.jsonb :settings, null: false, default: {}
      t.timestamps
    end
    create_table :subscription_destinations do |t|
      t.references :subscription, null: false, foreign_key: true
      t.references :delivery_destination, null: false, foreign_key: true
      t.integer :amount_cents, null: false
      t.string :amount_currency, null: false
      t.boolean :active, null: false, default: false
      t.boolean :selected, null: false, default: true
      t.timestamps
    end
    add_index :subscription_destinations,
              %i[subscription_id delivery_destination_id],
              unique: true,
              name: "index_subscription_destination_uniqueness"
    create_table :deliveries do |t|
      t.references :subscription, null: false, foreign_key: true
      t.references :delivery_destination, null: false, foreign_key: true
      t.references :step_execution, foreign_key: true
      t.string :event_key, null: false
      t.string :status, null: false, default: "pending"
      t.jsonb :payload, null: false, default: {}
      t.jsonb :destination_snapshot, null: false, default: {}
      t.string :provider_id
      t.string :error_code
      t.integer :attempts, null: false, default: 0
      t.datetime :next_attempt_at
      t.timestamps
    end
    add_index :deliveries,
              %i[subscription_id event_key delivery_destination_id],
              unique: true,
              name: "index_delivery_event_destination_uniqueness"
    add_index :deliveries, %i[status next_attempt_at]
    add_column :subscriptions,
               :delivery_pricing,
               :jsonb,
               null: false,
               default: {
               }
    add_column :subscriptions, :delivery_change_key, :string
    add_column :plans, :archived_at, :datetime
    add_reference :plans, :replacement_plan, foreign_key: { to_table: :plans }
    add_column :services,
               :delivery_enabled,
               :boolean,
               null: false,
               default: false
  end
end
