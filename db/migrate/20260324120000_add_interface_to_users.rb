# frozen_string_literal: true

class AddInterfaceToUsers < ActiveRecord::Migration[8.1]
  def up
    add_column(:users, :interface, :string, default: :simple, null: false)
  end

  def down
    remove_column(:users, :interface)
  end
end
