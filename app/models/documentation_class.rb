class DocumentationClass < ApplicationRecord
  belongs_to :parent, class_name: "DocumentationClass", optional: true

  has_many :children, class_name: "DocumentationClass", foreign_key: :parent_id

  validates :name, uniqueness: true, presence: true
end
