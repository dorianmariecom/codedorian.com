# frozen_string_literal: true

class AddPerformanceIndexes < ActiveRecord::Migration[8.1]
  def change
    add_index :addresses, %i[user_id verified primary],
              name: "index_addresses_on_user_id_and_verified_and_primary"
    
    add_index :devices, %i[user_id verified primary],
              name: "index_devices_on_user_id_and_verified_and_primary"
    
    add_index :email_addresses, %i[user_id verified primary],
              name: "index_email_addresses_on_user_id_and_verified_and_primary"
    
    add_index :handles, %i[user_id verified primary],
              name: "index_handles_on_user_id_and_verified_and_primary"
    
    add_index :names, %i[user_id verified primary],
              name: "index_names_on_user_id_and_verified_and_primary"
    
    add_index :passwords, %i[user_id verified primary],
              name: "index_passwords_on_user_id_and_verified_and_primary"
    
    add_index :phone_numbers, %i[user_id verified primary],
              name: "index_phone_numbers_on_user_id_and_verified_and_primary"
    
    add_index :time_zones, %i[user_id verified primary],
              name: "index_time_zones_on_user_id_and_verified_and_primary"
    
    add_index :tokens, %i[user_id verified primary],
              name: "index_tokens_on_user_id_and_verified_and_primary"
    
    add_index :program_schedules, :program_id,
              name: "index_program_schedules_on_program_id"
  end
end