# frozen_string_literal: true

class CreateReplPrompts < ActiveRecord::Migration[8.0]
  def change
    create_table "repl_prompts", force: :cascade do |t|
      t.datetime "created_at", null: false
      t.text "input"
      t.jsonb "output"
      t.bigint "repl_program_id"
      t.datetime "updated_at", null: false
      t.bigint "user_id"
      t.string "status", default: "initialized"
      t.text "backtrace"
      t.text "error_class"
      t.text "error_message"
      t.text "error_backtrace"
      t.index ["repl_program_id"]
      t.index ["user_id"]
    end

    remove_column :prompts, :program_type, :string
    add_index :prompts, :program_id
  end
end
