# frozen_string_literal: true

class MakeSchedulesPolymorphic < ActiveRecord::Migration[7.1]
  def up
    add_reference :schedules, :schedulable, polymorphic: true, index: true

    execute <<~SQL.squish
      UPDATE schedules
      SET schedulable_type = 'Program', schedulable_id = program_id
      WHERE program_id IS NOT NULL
    SQL

    change_table :schedules, bulk: true do |t|
      t.change_null :schedulable_type, false
      t.change_null :schedulable_id, false
      t.remove_references :program, index: true, foreign_key: true
    end
  end

  def down
    add_reference :schedules, :program, index: true, foreign_key: true

    execute <<~SQL.squish
      UPDATE schedules
      SET program_id = schedulable_id
      WHERE schedulable_type = 'Program'
    SQL

    remove_reference :schedules, :schedulable, polymorphic: true, index: true
  end
end
