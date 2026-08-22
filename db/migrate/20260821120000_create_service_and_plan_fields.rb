# frozen_string_literal: true

class CreateServiceAndPlanFields < ActiveRecord::Migration[8.0]
  def change
    create_table :service_fields do |t|
      t.references :service, null: false, foreign_key: true
      t.string :key, null: false
      t.string :kind, null: false
      t.boolean :required, null: false, default: false
      t.bigint :position, null: false, default: 0
      t.timestamps

      t.index %i[service_id key], unique: true
      t.index %i[service_id position]
    end

    create_table :plan_fields do |t|
      t.references :plan, null: false, foreign_key: true
      t.string :key, null: false
      t.string :kind, null: false
      t.boolean :required, null: false, default: false
      t.bigint :position, null: false, default: 0
      t.timestamps

      t.index %i[plan_id key], unique: true
      t.index %i[plan_id position]
    end

    create_table :subscription_values do |t|
      t.references :subscription, null: false, foreign_key: true
      t.string :key, null: false
      t.text :value
      t.timestamps

      t.index %i[subscription_id key], unique: true
    end
  end
end
