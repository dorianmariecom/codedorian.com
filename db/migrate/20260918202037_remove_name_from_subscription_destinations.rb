# frozen_string_literal: true

class RemoveNameFromSubscriptionDestinations < ActiveRecord::Migration[8.1]
  def change
    remove_column :subscription_destinations, :name, :string
  end
end
