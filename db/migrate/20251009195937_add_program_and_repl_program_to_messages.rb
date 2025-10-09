# frozen_string_literal: true

class AddProgramAndReplProgramToMessages < ActiveRecord::Migration[8.0]
  def change
    add_reference :messages, :program, index: true
    add_reference :messages, :repl_program, index: true
  end
end
