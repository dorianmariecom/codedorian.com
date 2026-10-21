# frozen_string_literal: true

class AddSettingOptionsToServiceFields < ActiveRecord::Migration[8.1]
  def change
    add_column :service_fields, :default_value, :text
    add_column :service_fields, :minimum, :decimal
    add_column :service_fields, :maximum, :decimal
  end
end
