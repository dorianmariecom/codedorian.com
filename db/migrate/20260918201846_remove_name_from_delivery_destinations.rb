# frozen_string_literal: true

class RemoveNameFromDeliveryDestinations < ActiveRecord::Migration[8.1]
  def change
    remove_column :delivery_destinations, :name, :string
  end
end
