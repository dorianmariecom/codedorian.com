class CreateAddresses < ActiveRecord::Migration[8.1]
  def change
    create_table :addresses do |t|
      t.references :user, null: false, foreign_key: true
      t.boolean :primary, default: false, null: false
      t.boolean :verified, default: false, null: false
      t.string :address
      t.jsonb :address_components
      t.string :formatted_address
      t.jsonb :geometry
      t.string :place_id
      t.jsonb :types

      t.timestamps
    end
  end
end
