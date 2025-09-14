# frozen_string_literal: true

class AddProperErrorsToPrompts < ActiveRecord::Migration[8.0]
  def change
    change_table :prompts, bulk: true do |t|
      t.remove :error, type: :text
      t.text :error_class
      t.text :error_message
      t.text :error_backtrace
    end
  end
end
