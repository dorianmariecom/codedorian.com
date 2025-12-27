# frozen_string_literal: true

class PhoneNumber < ApplicationRecord
  DEFAULT_COUNTRY_CODE = "US"

  belongs_to(:user, default: -> { Current.user! }, touch: true)

  scope(:primary, -> { where(primary: true) })
  scope(:not_primary, -> { where(primary: false) })
  scope(:verified, -> { where(verified: true) })
  scope(:not_verified, -> { where(verified: false) })
  scope(:where_user, ->(user) { where(user: user) })

  normalizes(
    :phone_number,
    with: ->(phone_number) { Phonelib.parse(phone_number).e164 }
  )

  validate { can!(:update, user) }
  validate { errors.add(:phone_number, :invalid) if phonelib.invalid? }
  validate { errors.add(:phone_number, :impossible) if phonelib.impossible? }

  before_validation { self.user ||= Current.user! }

  before_update { not_verified! if phone_number_changed? && verified? }

  delegate :e164, to: :phonelib

  def self.search_fields
    {
      phone_number: {
        node: -> { arel_table[:phone_number] },
        type: :string
      },
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

  def phonelib
    Phonelib.parse(phone_number)
  end

  def formatted
    phonelib.international
  end

  def to_s
    formatted.presence || t("to_s", id: id)
  end
end
