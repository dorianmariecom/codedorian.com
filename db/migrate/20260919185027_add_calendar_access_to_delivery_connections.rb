# frozen_string_literal: true

class AddCalendarAccessToDeliveryConnections < ActiveRecord::Migration[8.1]
  def change
    add_column :delivery_connections,
               :calendar_access,
               :boolean,
               default: false,
               null: false
  end
end
