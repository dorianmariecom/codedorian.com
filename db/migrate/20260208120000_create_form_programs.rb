# frozen_string_literal: true

class CreateFormPrograms < ActiveRecord::Migration[8.1]
  def change
    create_table(:form_programs) do |t|
      t.string(:locale, null: false, default: "en")
      t.string(:name)
      t.text(:description)
      t.bigint(:position, null: false, default: 0)

      t.timestamps
    end
  end
end
