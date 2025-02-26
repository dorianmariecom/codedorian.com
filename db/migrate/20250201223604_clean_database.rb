# frozen_string_literal: true

class CleanDatabase < ActiveRecord::Migration[8.1]
  def change
    User.destroy_all

    remove_column :users, :name
    remove_column :users, :time_zone

    remove_column :names, :handle
  end
end
