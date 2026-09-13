# frozen_string_literal: true

class AddShowFlagsToDeliveryChannels < ActiveRecord::Migration[8.0]
  def change
    add_column :delivery_channels,
               :show_recipient,
               :boolean,
               null: false,
               default: true
    add_column :delivery_channels,
               :show_visibility,
               :boolean,
               null: false,
               default: true

    reversible { |direction| direction.up { execute <<~SQL.squish } }
          UPDATE delivery_channels
          SET show_recipient = false,
              show_visibility = false
          WHERE key = 'messages'
        SQL
  end
end
