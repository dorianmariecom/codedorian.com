# frozen_string_literal: true

class CreateLinks < ActiveRecord::Migration[8.1]
  def change
    create_table(:links) do |t|
      t.string(:kind, null: false)
      t.text(:title_en)
      t.text(:title_fr)
      t.text(:path_input, null: false)
      t.text(:visibility_input)
      t.string(:image_ios)
      t.string(:image_android)
      t.bigint(:position, null: false, default: 0)
      t.boolean(:default, null: false, default: false)
      t.timestamps

      t.index(%i[kind position])
    end
  end
end
