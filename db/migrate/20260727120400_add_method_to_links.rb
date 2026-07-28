# frozen_string_literal: true

class AddMethodToLinks < ActiveRecord::Migration[8.1]
  def change
    add_column(:links, :method, :string, null: false, default: "get")
  end
end
