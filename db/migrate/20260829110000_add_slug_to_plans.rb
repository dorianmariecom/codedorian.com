# frozen_string_literal: true

class AddSlugToPlans < ActiveRecord::Migration[8.0]
  def up
    add_column :plans, :slug, :string

    execute <<~SQL.squish
      UPDATE plans
      SET slug = 'plan-' || id
      WHERE slug IS NULL
    SQL

    change_column_null :plans, :slug, false
    add_index :plans, %i[service_id slug], unique: true
  end

  def down
    remove_column :plans, :slug
  end
end
