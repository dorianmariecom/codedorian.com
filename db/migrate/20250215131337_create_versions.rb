# frozen_string_literal: true

class CreateVersions < ActiveRecord::Migration[8.1]
  def change
    create_table :versions do |t|
      t.bigint :whodunnit
      t.references :item, polymorphic: true, null: false
      t.string :event, null: false
      t.jsonb :object

      t.timestamps
    end

    add_index :versions, :item_type
    add_index :versions, :item_id
    add_index :versions, :whodunnit
    add_index :versions, :event
  end
end
