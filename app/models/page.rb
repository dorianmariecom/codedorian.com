# frozen_string_literal: true

class Page < ApplicationRecord
  belongs_to(:user, default: -> { Current.user! }, touch: true)
  belongs_to(:parent, class_name: "Page", optional: true, touch: true)
  has_many(
    :children,
    class_name: "Page",
    foreign_key: :parent_id,
    inverse_of: :parent,
    dependent: :destroy
  )

  has_rich_text(:title_en)
  has_rich_text(:title_fr)
  has_rich_text(:description_en)
  has_rich_text(:description_fr)
  has_rich_text(:body_en)
  has_rich_text(:body_fr)

  scope(:where_user, ->(user) { where(user: user) })

  validates(:path, presence: true, uniqueness: true)
  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }
  before_validation do
    self.path = "/#{path.to_s.strip}".squeeze("/") if path.present?
  end

  def self.search_fields
    {
      path: {
        node: -> { arel_table[:path] },
        type: :string
      },
      authorization_input: {
        node: -> { arel_table[:authorization_input] },
        type: :string
      },
      parent_id: {
        node: -> { arel_table[:parent_id] },
        type: :integer
      },
      **base_search_fields,
      **User.associated_search_fields
    }
  end

  def authorized?
    return true if authorization_input.blank?

    Code.evaluate(authorization_input).truthy?
  end

  def ancestors
    parent&.ancestors.to_a + [self]
  end

  def title
    fr? ? title_fr : title_en
  end

  def description
    fr? ? description_fr : description_en
  end

  def body
    fr? ? body_fr : body_en
  end

  def title_sample
    Truncate.strip(title&.to_plain_text)
  end

  def title_en_sample
    Truncate.strip(title_en&.to_plain_text)
  end

  def title_fr_sample
    Truncate.strip(title_fr&.to_plain_text)
  end

  def description_sample
    Truncate.strip(description&.to_plain_text)
  end

  def description_en_sample
    Truncate.strip(description_en&.to_plain_text)
  end

  def description_fr_sample
    Truncate.strip(description_fr&.to_plain_text)
  end

  def body_sample
    Truncate.strip(body&.to_plain_text)
  end

  def body_en_sample
    Truncate.strip(body_en&.to_plain_text)
  end

  def body_fr_sample
    Truncate.strip(body_fr&.to_plain_text)
  end

  def path_sample
    Truncate.strip(path)
  end

  def parent_sample
    Truncate.strip(parent)
  end

  def user_sample
    Truncate.strip(user)
  end

  def to_s
    label =
      title_sample.presence || description_sample.presence ||
        body_sample.presence || title_en_sample.presence ||
        title_fr_sample.presence || description_en_sample.presence ||
        description_fr_sample.presence || body_en_sample.presence ||
        body_fr_sample.presence || path_sample.presence
    Utils.join(
      label.presence || parent_sample.presence || user_sample,
      id_sample
    ).presence || t("to_s", id:)
  end
end
