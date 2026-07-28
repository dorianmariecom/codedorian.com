# frozen_string_literal: true

class RenamePageAuthorizationToAuthorizationInput < ActiveRecord::Migration[8.1]
  def change
    rename_column(:pages, :authorization, :authorization_input)
  end
end
