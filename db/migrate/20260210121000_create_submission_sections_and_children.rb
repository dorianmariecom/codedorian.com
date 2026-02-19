# frozen_string_literal: true

class CreateSubmissionSectionsAndChildren < ActiveRecord::Migration[8.1]
  def change
    create_table(:submission_sections) do |t|
      t.bigint(:submission_id, null: false)
      t.string(:locale, null: false, default: "en")
      t.string(:name)
      t.text(:description)

      t.timestamps
    end

    add_index(:submission_sections, :submission_id)

    create_table(:submission_programs) do |t|
      t.bigint(:submission_section_id, null: false)
      t.string(:locale, null: false, default: "en")
      t.string(:name)
      t.text(:description)

      t.timestamps
    end

    add_index(:submission_programs, :submission_section_id)

    create_table(:submission_schedules) do |t|
      t.bigint(:submission_section_id, null: false)
      t.string(:locale, null: false, default: "en")
      t.datetime(:starts_at)
      t.string(:interval)
      t.string(:name)
      t.text(:description)

      t.timestamps
    end

    add_index(:submission_schedules, :submission_section_id)

    create_table(:submission_deliveries) do |t|
      t.bigint(:submission_section_id, null: false)
      t.string(:locale, null: false, default: "en")
      t.string(:name)
      t.text(:description)

      t.timestamps
    end

    add_index(:submission_deliveries, :submission_section_id)
  end
end
