class Message < ApplicationRecord
  belongs_to :from_user,
             class_name: "User",
             default: -> { Current.user! },
             touch: true
  belongs_to :to_user,
             class_name: "User",
             default: -> { Current.user! },
             touch: true

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

  def to_s
    subject&.to_plain_text.presence || "message##{id}"
  end
end
