# frozen_string_literal: true

class CreateLogs < ActiveRecord::Migration[8.1]
  def change
    create_table(:logs) do |t|
      t.text(:message)
      t.jsonb(:context)
      t.timestamps
    end
  end
end
