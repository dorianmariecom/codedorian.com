# frozen_string_literal: true

class AddCompositeIndexToProgramExecutions < ActiveRecord::Migration[8.1]
  def change
    # Add composite index to optimize the query:
    # SELECT "program_executions".* FROM "program_executions"
    # WHERE "program_executions"."program_id" IN ($1, $2, ...)
    # ORDER BY "program_executions"."created_at" DESC
    #
    # This query is executed when eager loading the has_one :program_execution
    # relationship with order(created_at: :desc) in SchedulingJob.
    #
    # The composite index on (program_id, created_at DESC) allows PostgreSQL to:
    # 1. Use the index to efficiently filter by program_id
    # 2. Use the same index to sort by created_at DESC without additional sorting
    # This significantly reduces query time from 1304ms to a few milliseconds.
    add_index :program_executions,
              %i[program_id created_at],
              order: { created_at: :desc },
              name: "index_program_executions_on_program_id_and_created_at"
  end
end