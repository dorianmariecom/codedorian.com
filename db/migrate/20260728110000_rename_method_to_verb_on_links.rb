# frozen_string_literal: true

class RenameMethodToVerbOnLinks < ActiveRecord::Migration[8.1]
  def change
    rename_column(:links, :method, :verb)
  end
end
