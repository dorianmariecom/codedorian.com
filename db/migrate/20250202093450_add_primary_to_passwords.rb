class AddPrimaryToPasswords < ActiveRecord::Migration[8.1]
  def change
    add_column :passwords, :primary, :boolean, default: false, null: false
    add_column :passwords, :verified, :boolean, default: false, null: false
  end
end
