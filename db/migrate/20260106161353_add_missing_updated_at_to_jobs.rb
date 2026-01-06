# frozen_string_literal: true

class AddMissingUpdatedAtToJobs < ActiveRecord::Migration[8.1]
  def change
    add_column(:solid_queue_blocked_executions, :updated_at, :datetime)
    add_column(:solid_queue_claimed_executions, :updated_at, :datetime)
    add_column(:solid_queue_failed_executions, :updated_at, :datetime)
    add_column(:solid_queue_pauses, :updated_at, :datetime)
    add_column(:solid_queue_processes, :updated_at, :datetime)
    add_column(:solid_queue_ready_executions, :updated_at, :datetime)
    add_column(:solid_queue_recurring_executions, :updated_at, :datetime)
    add_column(:solid_queue_scheduled_executions, :updated_at, :datetime)
  end
end
