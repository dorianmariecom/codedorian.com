# frozen_string_literal: true

class Attachment < ApplicationRecord
  belongs_to(:user, default: -> { Current.user! }, touch: true)

  has_one_attached(:file)

  validates(:file, attached: true)

  def self.search_fields
    { **base_search_fields, **User.associated_search_fields }
  end

  def preview_path
    url_helpers.attachment_preview_path(id: signed_id) if persisted?
  end

  def preview_url
    url_helpers.attachment_preview_url(id: signed_id) if persisted?
  end

  def download_path
    url_helpers.attachment_download_path(id: signed_id) if persisted?
  end

  def download_url
    url_helpers.attachment_download_url(id: signed_id) if persisted?
  end

  def to_code
    Code::Object::Attachment.new(
      id: id,
      preview_path: preview_path,
      preview_url: preview_url,
      download_path: download_path,
      download_url: download_url
    )
  end

  def to_s
    t("to_s", id: id)
  end
end
