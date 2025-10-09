# frozen_string_literal: true

class CreateJobContexts < ActiveRecord::Migration[8.0]
  def change
    create_table :job_contexts do |t|
      t.string :active_job_id, null: false
      t.jsonb :context

      t.timestamps
      t.index :active_job_id
    end
  end
end
