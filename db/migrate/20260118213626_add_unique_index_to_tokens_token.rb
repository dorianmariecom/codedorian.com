# frozen_string_literal: true

class AddUniqueIndexToTokensToken < ActiveRecord::Migration[8.1]
  def change
    add_index(:tokens, :token, unique: true)
  end
end
