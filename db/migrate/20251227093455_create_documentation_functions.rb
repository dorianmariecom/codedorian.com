class CreateDocumentationFunctions < ActiveRecord::Migration[8.1]
  def change
    create_table :documentation_functions do |t|
      t.references :documentation_class, null: false, foreign_key: true

      t.string :name, null: false
      t.text :description

      t.timestamps
    end
  end
end
