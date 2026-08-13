# frozen_string_literal: true

class RemoveNameFromSteps < ActiveRecord::Migration[8.0]
  def change
    remove_column :steps, :name, :string
  end
end
