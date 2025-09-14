# frozen_string_literal: true

class AddErrorToExecutions < ActiveRecord::Migration[8.0]
  def change
    add_column :executions, :error, :text
  end
end
