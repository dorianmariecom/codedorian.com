# frozen_string_literal: true

class AddVerifiedAndPrimaryToDevicesAndTokens < ActiveRecord::Migration[8.1]
  def change
    add_column :devices, :verified, :boolean, default: false, null: false
    add_column :devices, :primary, :boolean, default: false, null: false
    add_column :tokens, :verified, :boolean, default: false, null: false
    add_column :tokens, :primary, :boolean, default: false, null: false
  end
end
