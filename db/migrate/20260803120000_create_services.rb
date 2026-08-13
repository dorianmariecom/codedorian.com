# frozen_string_literal: true

class CreateServices < ActiveRecord::Migration[8.0]
  def change
    create_table :services do |t|
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end

    create_table :steps do |t|
      t.references :service, null: false, foreign_key: true
      t.string :name
      t.bigint :position, null: false, default: 0
      t.text :input
      t.bigint :offset_seconds, null: false, default: 0
      t.timestamps
      t.index %i[service_id position], unique: true
    end

    create_table :plans do |t|
      t.references :service, null: false, foreign_key: true
      t.timestamps
    end

    create_table :plan_schedules do |t|
      t.references :plan, null: false, foreign_key: true
      t.string :interval
      t.datetime :starts_at
      t.timestamps
    end

    create_table :subscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :plan, null: false, foreign_key: true
      t.string :status, null: false, default: "active"
      t.timestamps
      t.index %i[user_id plan_id], unique: true
      t.index :status
    end

    create_table :subscription_executions do |t|
      t.references :subscription, null: false, foreign_key: true
      t.string :status, null: false, default: "initialized"
      t.timestamps
      t.index :status
    end

    create_table :step_executions do |t|
      t.references :subscription_execution, null: false, foreign_key: true
      t.references :step, null: false, foreign_key: true
      t.string :status, null: false, default: "initialized"
      t.text :input
      t.text :output
      t.text :error
      t.text :error_class
      t.text :error_message
      t.text :error_backtrace
      t.text :result
      t.timestamps
      t.index :status
    end
  end
end
