# frozen_string_literal: true

class CreateCountryCodeIpAddresses < ActiveRecord::Migration[8.1]
  def change
    create_table :country_code_ip_addresses do |t|
      t.string :ip_address, null: false
      t.string :country_code

      t.timestamps

      t.index :ip_address, unique: true
    end
  end
end
