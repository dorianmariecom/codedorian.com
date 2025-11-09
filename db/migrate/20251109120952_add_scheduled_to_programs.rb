class AddScheduledToPrograms < ActiveRecord::Migration[8.1]
  def change
    add_column(:programs, :scheduled, :boolean, default: false, null: false)
  end
end
