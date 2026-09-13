# frozen_string_literal: true

class DefaultDeliveryChannelShowFlagsToFalse < ActiveRecord::Migration[8.0]
  def change
    change_column_default :delivery_channels,
                          :show_recipient,
                          from: true,
                          to: false
    change_column_default :delivery_channels,
                          :show_visibility,
                          from: true,
                          to: false
  end
end
