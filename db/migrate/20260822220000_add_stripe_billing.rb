# frozen_string_literal: true

class AddStripeBilling < ActiveRecord::Migration[8.1]
  def change
    add_column :plans, :pricing_input, :text
    add_column :users, :stripe_customer_id, :string
    add_index :users, :stripe_customer_id, unique: true

    change_column_default :subscriptions,
                          :status,
                          from: "active",
                          to: "inactive"
    add_column :subscriptions, :amount_cents, :bigint
    add_column :subscriptions, :amount_currency, :string
    add_column :subscriptions, :stripe_checkout_session_id, :string
    add_column :subscriptions, :stripe_checkout_idempotency_key, :string
    add_column :subscriptions, :stripe_subscription_id, :string
    add_column :subscriptions, :stripe_status, :string
    add_column :subscriptions, :current_period_start, :datetime
    add_column :subscriptions, :current_period_end, :datetime
    add_column :subscriptions,
               :cancel_at_period_end,
               :boolean,
               default: false,
               null: false
    add_index :subscriptions, :stripe_checkout_session_id, unique: true
    add_index :subscriptions, :stripe_subscription_id, unique: true
    add_index :subscriptions, :stripe_status

    create_table :stripe_invoices do |t|
      t.references :subscription, null: false, foreign_key: true
      t.string :stripe_invoice_id, null: false
      t.string :stripe_payment_intent_id
      t.string :number
      t.string :status
      t.bigint :amount_due, null: false, default: 0
      t.bigint :amount_paid, null: false, default: 0
      t.string :currency, null: false
      t.datetime :period_start
      t.datetime :period_end
      t.datetime :paid_at
      t.text :hosted_invoice_url
      t.text :invoice_pdf
      t.timestamps
    end
    add_index :stripe_invoices, :stripe_invoice_id, unique: true
    add_index :stripe_invoices, :stripe_payment_intent_id
    add_index :stripe_invoices, :status

    create_table :stripe_events do |t|
      t.string :stripe_event_id, null: false
      t.string :event_type, null: false
      t.boolean :livemode, null: false, default: false
      t.datetime :stripe_created_at, null: false
      t.jsonb :payload, null: false, default: {}
      t.string :status, null: false, default: "pending"
      t.datetime :processed_at
      t.text :processing_error
      t.timestamps
    end
    add_index :stripe_events, :stripe_event_id, unique: true
    add_index :stripe_events, :event_type
    add_index :stripe_events, :status

    reversible do |direction|
      direction.up { execute("UPDATE subscriptions SET status = 'inactive'") }
    end
  end
end
