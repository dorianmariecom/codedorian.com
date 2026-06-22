# frozen_string_literal: true

class CreatePages < ActiveRecord::Migration[8.1]
  def change
    create_table(:pages) do |t|
      t.references(:user, null: false, foreign_key: true)
      t.references(:parent, foreign_key: { to_table: :pages })
      t.string(:path, null: false)
      t.text(:authorization)

      t.timestamps

      t.index(:path)
    end
  end
end
