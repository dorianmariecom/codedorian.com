# frozen_string_literal: true

class ChangeAddresses < ActiveRecord::Migration[8.0]
  def up
    drop_table :addresses

    create_table "addresses", force: :cascade do |t|
      t.string "address"
      t.jsonb "autocomplete"
      t.boolean "primary", default: false, null: false
      t.boolean "verified", default: false, null: false
      t.bigint "user_id", null: false
      t.index ["user_id"], name: "index_addresses_on_user_id"
      t.datetime "updated_at", null: false
      t.datetime "created_at", null: false
    end
  end

  def down
  end
end
