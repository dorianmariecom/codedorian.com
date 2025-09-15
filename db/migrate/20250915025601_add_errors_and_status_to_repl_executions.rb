# frozen_string_literal: true

class AddErrorsAndStatusToReplExecutions < ActiveRecord::Migration[8.0]
  def change
    add_column(:repl_executions, :status, :string, default: :initialized)
    add_column(:repl_executions, :error_class, :text)
    add_column(:repl_executions, :error_message, :text)
    add_column(:repl_executions, :error_backtrace, :text)

    ReplExecution.find_each do |repl_execution|
      next if repl_execution.error.blank?

      error_class, error_message = repl_execution.error.split(": ", 2)

      ::Current.with(user: repl_execution.user) do
        repl_execution.update!(
          error: nil,
          error_class: error_class,
          error_message: error_message
        )
      end
    end

    ReplExecution.where(error_class: nil).update_all(status: :done)
    ReplExecution.where.not(error_class: nil).update_all(status: :errored)
  end
end
