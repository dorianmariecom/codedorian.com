# frozen_string_literal: true

class AddNameToPrograms < ActiveRecord::Migration[8.1]
  def change
    add_column :programs, :name, :string
  end
end
