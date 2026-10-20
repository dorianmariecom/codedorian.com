# frozen_string_literal: true

class AddDeliveryInputToDeliveryChannels < ActiveRecord::Migration[8.1]
  def change
    add_column :delivery_channels, :delivery_input, :text
  end
end
