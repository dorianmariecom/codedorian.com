# frozen_string_literal: true

class RemoveProgramAndReadFromMessages < ActiveRecord::Migration[7.1]
  def change
    remove_index(:messages, :program_id, if_exists: true)
    remove_column(:messages, :program_id, :bigint)
    remove_column(:messages, :read, :boolean)
  end
end
