# frozen_string_literal: true

class AddBacktraceToPrompts < ActiveRecord::Migration[8.0]
  def change
    add_column :prompts, :backtrace, :text
  end
end
