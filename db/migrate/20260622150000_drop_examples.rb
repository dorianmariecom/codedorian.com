# frozen_string_literal: true

class DropExamples < ActiveRecord::Migration[8.1]
  def up
    execute(<<~SQL.squish)
      DELETE FROM action_text_rich_texts
      WHERE record_type = 'Example'
    SQL

    drop_table(:example_schedules, if_exists: true)
    drop_table(:examples, if_exists: true)
  end

  def down
    create_table(:examples) do |t|
      t.text(:input)
      t.string(:locale, default: "en", null: false)
      t.string(:name)
      t.bigint(:position, default: 0, null: false)

      t.timestamps
    end

    create_table(:example_schedules) do |t|
      t.references(:example, null: false, foreign_key: true)
      t.string(:interval)
      t.datetime(:starts_at)

      t.timestamps
    end
  end
end
