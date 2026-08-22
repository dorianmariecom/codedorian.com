# frozen_string_literal: true

class RemoveFormsSubmissionsAndFeedback < ActiveRecord::Migration[8.1]
  def up
    execute(<<~SQL.squish)
      DELETE FROM links
      WHERE path_input LIKE '%/form%'
    SQL

    drop_table(:submission_deliveries, if_exists: true)
    drop_table(:submission_schedules, if_exists: true)
    drop_table(:submission_programs, if_exists: true)
    drop_table(:submission_sections, if_exists: true)
    drop_table(:submissions, if_exists: true)
    drop_table(:form_deliveries, if_exists: true)
    drop_table(:form_schedules, if_exists: true)
    drop_table(:form_programs, if_exists: true)
    drop_table(:feedbacks, if_exists: true)
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
