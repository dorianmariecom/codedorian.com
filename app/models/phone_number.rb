# frozen_string_literal: true

class PhoneNumber < ApplicationRecord
  DEFAULT_COUNTRY_CODE = "FR"

  belongs_to :user, default: -> { Current.user! }, touch: true

  scope :primary, -> { where(primary: true) }
  scope :not_primary, -> { where(primary: false) }
  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }

  normalizes(
    :phone_number,
    with: ->(phone_number) { Phonelib.parse(phone_number).e164 }
  )

  validate { can!(:update, user) }
  validate { errors.add(:phone_number, :invalid) if phonelib.invalid? }
  validate { errors.add(:phone_number, :impossible) if phonelib.impossible? }

  before_validation { log_in(self.user ||= User.create!) }

  before_update { not_verified! if phone_number_changed? && verified? }

  delegate :e164, to: :phonelib

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
    formatted.presence || t("to_s", id:)
  end
end
