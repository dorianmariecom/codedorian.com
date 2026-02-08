# frozen_string_literal: true

class CreateFormDeliveries < ActiveRecord::Migration[7.1]
  def change
    create_table(:form_deliveries) do |t|
      t.string(:locale, null: false, default: "en")
      t.string(:name)
      t.text(:description)
      t.bigint(:position, null: false, default: 0)

      t.timestamps
    end
  end
end
