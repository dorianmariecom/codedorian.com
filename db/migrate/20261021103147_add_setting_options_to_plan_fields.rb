# frozen_string_literal: true

class AddSettingOptionsToPlanFields < ActiveRecord::Migration[8.1]
  def change
    add_column :plan_fields, :default_value, :text
    add_column :plan_fields, :minimum, :decimal
    add_column :plan_fields, :maximum, :decimal
  end
end
