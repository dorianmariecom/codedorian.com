class CreateDocumentationClasses < ActiveRecord::Migration[8.1]
  def change
    create_table :documentation_classes do |t|
      t.references :parent, foreign_key: { to_table: :documentation_classes }

      t.string :name, null: false
      t.text :description

      t.timestamps

      t.index :name
    end
  end
end
