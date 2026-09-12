# frozen_string_literal: true

class RemoveDeliveryRolloutFlags < ActiveRecord::Migration[8.0]
  def change
    remove_reference :plans,
                     :replacement_plan,
                     foreign_key: {
                       to_table: :plans
                     }
    remove_column :plans, :archived_at, :datetime
    remove_column :services,
                  :delivery_enabled,
                  :boolean,
                  default: false,
                  null: false
  end
end
