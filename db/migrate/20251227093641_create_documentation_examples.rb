class CreateDocumentationExamples < ActiveRecord::Migration[8.1]
  def change
    create_table :documentation_examples do |t|
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
