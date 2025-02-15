# frozen_string_literal: true

class AddObjectChangesToVersions < ActiveRecord::Migration[8.1]
  def change
    add_column :versions, :object_changes, :jsonb
  end
end
