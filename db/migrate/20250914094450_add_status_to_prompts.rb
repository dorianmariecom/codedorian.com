class AddStatusToPrompts < ActiveRecord::Migration[8.0]
  def change
    add_column :prompts, :status, :string, default: :initialized
    add_column :prompts, :error, :text
  end
end
