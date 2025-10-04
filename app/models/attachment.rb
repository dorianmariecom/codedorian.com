# frozen_string_literal: true

class Attachment < ApplicationRecord
  belongs_to(:user, default: -> { Current.user! }, touch: true)

  has_one_attached(:file)

  validates(:file, attached: true)

  def self.search_fields
    { **base_search_fields, **User.associated_search_fields }
  end

  def url
    url_helpers.attachment_url(id: signed_id)
  end

  def to_s
    t("to_s", id: id)
  end
end
