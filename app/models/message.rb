class Message < ApplicationRecord
  belongs_to :from_user, class_name: "User"
  belongs_to :to_user, class_name: "User"

  has_rich_text :subject
  has_rich_text :body

  scope :read, -> { where(read: true) }
  scope :unread, -> { where(read: false) }

  def read!
    update!(read: true)
  end

  def unread!
    update!(read: false)
  end
end
