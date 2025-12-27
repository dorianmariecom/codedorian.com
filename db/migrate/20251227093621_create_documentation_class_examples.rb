class CreateDocumentationClassExamples < ActiveRecord::Migration[8.1]
  def change
    create_table :documentation_class_examples do |t|
      t.references :documentation_class, null: false, foreign_key: true

      t.string :name, null: false
      t.text :description
      t.text :input, null: false
      t.text :error
      t.text :output
      t.text :result

      t.timestamps
    end
  end
end
