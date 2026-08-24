# frozen_string_literal: true

class AllowMultipleSubscriptionsPerPlan < ActiveRecord::Migration[8.1]
  def change
    remove_index :subscriptions, %i[user_id plan_id]
    add_index :subscriptions, %i[user_id plan_id]
  end
end
