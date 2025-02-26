# frozen_string_literal: true

class DropLocations < ActiveRecord::Migration[8.1]
  def change
    drop_table :locations
  end
end
