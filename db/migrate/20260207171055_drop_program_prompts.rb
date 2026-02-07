# frozen_string_literal: true

class DropProgramPrompts < ActiveRecord::Migration[7.0]
  def up
    drop_table(:program_prompt_schedules, if_exists: true)
    drop_table(:program_prompts, if_exists: true)
  end

  def down
    create_table(:program_prompts) do |t|
      t.text(:backtrace)
      t.text(:error_backtrace)
      t.text(:error_class)
      t.text(:error_message)
      t.text(:input)
      t.text(:name)
      t.jsonb(:output)
      t.bigint(:program_id)
      t.string(:status, default: "initialized")
      t.bigint(:user_id)
      t.timestamps
    end

    add_index(:program_prompts, :program_id)
    add_index(:program_prompts, :user_id)

    create_table(:program_prompt_schedules) do |t|
      t.string(:interval)
      t.bigint(:program_prompt_id, null: false)
      t.datetime(:starts_at)
      t.timestamps
    end

    add_index(:program_prompt_schedules, :program_prompt_id)

    add_foreign_key(:program_prompt_schedules, :program_prompts)
    add_foreign_key(:program_prompts, :users)
  end
end
