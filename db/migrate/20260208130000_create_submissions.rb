# frozen_string_literal: true

class CreateSubmissions < ActiveRecord::Migration[7.1]
  def change
    create_table(:submissions) do |t|
      t.string(:email_address)
      t.string(:phone_number)
      t.string(:given_name)
      t.string(:family_name)
      t.string(:locale, null: false, default: "en")

      t.timestamps
    end
  end
end
