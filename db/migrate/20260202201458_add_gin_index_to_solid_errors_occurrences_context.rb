# frozen_string_literal: true

class AddGinIndexToSolidErrorsOccurrencesContext < ActiveRecord::Migration[7.0]
  disable_ddl_transaction!

  def up
    execute(<<~SQL.squish)
      ALTER TABLE solid_errors_occurrences
      ALTER COLUMN context TYPE jsonb
      USING context::jsonb
    SQL

    execute(<<~SQL.squish)
      CREATE INDEX CONCURRENTLY index_solid_errors_occurrences_on_context_gin
      ON solid_errors_occurrences USING gin (context)
    SQL
  end

  def down
    execute(<<~SQL.squish)
      DROP INDEX CONCURRENTLY IF EXISTS index_solid_errors_occurrences_on_context_gin
    SQL

    execute(<<~SQL.squish)
      ALTER TABLE solid_errors_occurrences
      ALTER COLUMN context TYPE json
      USING context::json
    SQL
  end
end
