# frozen_string_literal: true

class UpdateExecutions < ActiveRecord::Migration[8.0]
  def change
    Execution.where(error_class: nil).update_all(status: :done)
    Execution.where.not(error_class: nil).update_all(status: :errored)
  end
end
