# frozen_string_literal: true

class AddCompositeIndexesToTimeZones < ActiveRecord::Migration[8.1]
  def change
    add_index :time_zones, %i[user_id verified primary],
              name: "index_time_zones_on_user_id_verified_primary"
    add_index :time_zones, %i[user_id verified],
              name: "index_time_zones_on_user_id_verified"
  end
end