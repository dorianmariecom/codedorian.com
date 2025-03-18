# frozen_string_literal: true

class AddVerifiedAndPrimaryToDevicesAndTokens < ActiveRecord::Migration[8.1]
  def change
    change_table :devices, bulk: true do |t|
      t.boolean :verified, default: false, null: false
      t.boolean :primary, default: false, null: false
    end

    change_table :tokens, bulk: true do |t|
      t.boolean :verified, default: false, null: false
      t.boolean :primary, default: false, null: false
    end
  end
end
