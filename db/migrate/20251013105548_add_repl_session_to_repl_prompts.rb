# frozen_string_literal: true

class AddReplSessionToReplPrompts < ActiveRecord::Migration[8.0]
  def change
    add_reference(:repl_prompts, :repl_session, foreign_key: true)
  end
end
