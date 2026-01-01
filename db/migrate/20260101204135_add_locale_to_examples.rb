# frozen_string_literal: true

class AddLocaleToExamples < ActiveRecord::Migration[8.1]
  def change
    add_column(:examples, :locale, :string, default: :en, null: false)
  end
end
