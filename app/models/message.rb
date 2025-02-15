# frozen_string_literal: true

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

  def unread?
    !read?
  end

  def read_versions
    versions.where("object_changes::jsonb->>'read' = '[false, true]'")
  end

  def read_version
    read_versions.last
  end

  def read_at
    read_version&.created_at
  end

  def unread_versions
    versions.where("object_changes::jsonb->>'read' = '[true, false]'")
  end

  def unread_version
    unread_versions.last
  end

  def unread_at
    unread_version&.created_at
  end

  def to_s
    subject&.to_plain_text.presence || "message##{id}"
  end
end
