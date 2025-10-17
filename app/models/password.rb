# frozen_string_literal: true

class Password < ApplicationRecord
  attr_accessor :password_changed

  has_secure_password

  belongs_to(:user, default: -> { Current.user! }, touch: true)

  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }

  scope(:primary, -> { where(primary: true) })
  scope(:not_primary, -> { where(primary: false) })
  scope(:verified, -> { where(verified: true) })
  scope(:not_verified, -> { where(verified: false) })
  scope(:where_user, ->(user) { where(user: user) })

  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }
  before_update { not_verified! if password_changed && verified? }

  def self.search_fields
    {
      primary: {
        node: -> { arel_table[:primary] },
        type: :boolean
      },
      verified: {
        node: -> { arel_table[:verified] },
        type: :boolean
      },
      **base_search_fields,
      **User.associated_search_fields
    }
  end

  def primary?
    !!primary
  end

  def not_primary?
    !primary?
  end

  def primary!
    update!(primary: true)
  end

  def not_primary!
    update!(primary: false)
  end

  def verified?
    !!verified
  end

  def not_verified?
    !verified?
  end

  def verified!
    update!(verified: true)
  end

  def not_verified!
    update!(verified: false)
  end

  def password
    "***"
  end

  def password=(...)
    self.password_changed = true
    super
  end

  def to_s
    hint.presence || t("to_s", id: id)
  end
end
