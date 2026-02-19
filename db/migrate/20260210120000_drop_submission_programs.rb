# frozen_string_literal: true

class DropSubmissionPrograms < ActiveRecord::Migration[8.1]
  def change
    drop_table(:submission_programs) do |t|
      t.bigint(:submission_id, null: false)
      t.bigint(:form_schedule_id)
      t.bigint(:form_program_id)
      t.bigint(:form_delivery_id)
      t.string(:name)
      t.text(:description)
      t.bigint(:position, null: false, default: 0)
      t.string(:form_program_name)
      t.text(:form_program_description)
      t.datetime(:form_schedule_starts_at)
      t.string(:form_schedule_interval)
      t.string(:form_schedule_name)
      t.text(:form_schedule_description)
      t.string(:form_delivery_name)
      t.text(:form_delivery_description)
      t.timestamps
    end
  end
end
