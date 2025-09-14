# frozen_string_literal: true

class AddStatusToPrompts < ActiveRecord::Migration[8.0]
  def change
    change_table :prompts, bulk: true do |t|
      t.string :status, default: :initialized
      t.text :error
    end
  end
end
