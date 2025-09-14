# frozen_string_literal: true

class ExecutionsStatusAndErrors < ActiveRecord::Migration[8.0]
  def change
    add_column :executions, :status, :string, default: :initialized
    add_column :executions, :error_class, :text
    add_column :executions, :error_message, :text
    add_column :executions, :error_backtrace, :text

    Execution.find_each do |execution|
      next if execution.error.blank?

      error_class, error_message = execution.error.split(": ", 2)

      ::Current.with(user: execution.user) do
        execution.update!(
          error_class: error_class,
          error_message: error_message
        )
      end
    end

    remove_column :executions, :error, :text
  end
end
