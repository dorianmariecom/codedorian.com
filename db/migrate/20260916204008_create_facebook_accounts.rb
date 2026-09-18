# frozen_string_literal: true

class CreateFacebookAccounts < ActiveRecord::Migration[8.1]
  def change
    create_table :facebook_accounts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :facebook_id, null: false
      t.string :name, null: false
      t.string :messenger_page_id
      t.string :messenger_recipient_id
      t.string :messenger_status, null: false, default: "pending"
      t.boolean :enabled, null: false, default: true
      t.timestamps
    end
    add_index :facebook_accounts, %i[user_id facebook_id], unique: true
  end
end
