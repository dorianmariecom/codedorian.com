# frozen_string_literal: true

class CreateCountries < ActiveRecord::Migration[8.1]
  def change
    create_table :countries do |t|
      t.references :user, null: false, foreign_key: true
      t.boolean :primary, null: false, default: false
      t.boolean :verified, null: false, default: false
      t.string :ip_address, null: false
      t.string :name
      t.string :alpha2
      t.string :alpha3
      t.string :numeric_code
      t.string :hostname
      t.string :city
      t.string :region
      t.string :region_code
      t.string :continent
      t.string :continent_code
      t.decimal :latitude, precision: 10, scale: 7
      t.decimal :longitude, precision: 10, scale: 7
      t.string :postal_code
      t.string :time_zone
      t.string :organization
      t.boolean :anycast
      t.boolean :bogon
      t.boolean :anonymous
      t.boolean :hosting
      t.boolean :mobile
      t.boolean :satellite
      t.jsonb :asn, null: false, default: {}
      t.jsonb :company, null: false, default: {}
      t.jsonb :privacy, null: false, default: {}
      t.jsonb :abuse, null: false, default: {}
      t.jsonb :domains, null: false, default: {}
      t.jsonb :carrier, null: false, default: {}
      t.jsonb :raw_payload, null: false, default: {}
      t.timestamps
    end

    add_index :countries, %i[user_id ip_address], unique: true
    add_index :countries, %i[user_id verified primary]

    change_table :country_code_ip_addresses, bulk: true do |t|
      t.jsonb :raw_payload, null: false, default: {}
      t.datetime :lookup_enqueued_at
      t.datetime :looked_up_at
    end
  end
end
