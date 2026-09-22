# frozen_string_literal: true

class RenameOnlyToVisibilityRestrictionOnDeliveryChannels < ActiveRecord::Migration[8.1]
  def change
    rename_column :delivery_channels, :only, :visibility_restriction
  end
end
