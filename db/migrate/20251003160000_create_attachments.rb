# frozen_string_literal: true

class CreateAttachments < ActiveRecord::Migration[8.0]
  def change
    create_table :attachments do |t|
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
