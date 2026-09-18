# frozen_string_literal: true

class AddXConnectionTokens < ActiveRecord::Migration[8.1]
  def change
    add_column :delivery_connections, :refresh_token, :text
    add_column :delivery_connections, :token_expires_at, :datetime
  end
end
