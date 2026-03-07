# frozen_string_literal: true

class CreateFeedbacks < ActiveRecord::Migration[8.1]
  def change
    create_table(:feedbacks) do |t|
      t.references(:user, null: true, foreign_key: true)
      t.references(:guest, null: true, foreign_key: true)
      t.text(:message)
      t.string(:locale)
      t.string(:path)
      t.string(:ip)
      t.text(:user_agent)

      t.timestamps
    end
  end
end
