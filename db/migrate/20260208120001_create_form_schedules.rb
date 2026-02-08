# frozen_string_literal: true

class CreateFormSchedules < ActiveRecord::Migration[7.1]
  def change
    create_table(:form_schedules) do |t|
      t.string(:locale, null: false, default: "en")
      t.datetime(:starts_at)
      t.string(:interval)
      t.string(:name)
      t.text(:description)
      t.bigint(:position, null: false, default: 0)

      t.timestamps
    end
  end
end
