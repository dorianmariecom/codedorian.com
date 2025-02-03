class AddGivenNameFamilyNameAndHandleToNames < ActiveRecord::Migration[8.1]
  def change
    add_column :names, :given_name, :string
    add_column :names, :family_name, :string
    add_column :names, :handle, :string
    remove_column :names, :name
  end
end
