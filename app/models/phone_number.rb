# frozen_string_literal: true

class PhoneNumber < ApplicationRecord
  DEFAULT_COUNTRY_CODE = "FR"
  BRAND = "CodeDorian"
  VERIFICATION_CODE_REGEXP = /\A[0-9 ]+\z/

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

  before_update do
    unverify! if phone_number_changed? && (verified? || verifying?)
  end

  def primary?
    !!primary
  end

  def not_primary?
    !primary?
  end

  def verified?
    !!verified
  end

  def not_verified?
    !verified?
  end

  def phonelib
    Phonelib.parse(phone_number)
  end

  delegate :e164, to: :phonelib

  def formatted
    phonelib.international
  end

  def verification_code_sent?
    verification_code.present?
  end

  def verify!(_code)
    update!(verified: true, verification_code: "")
  end

  def cancel_verification!
    update!(verified: false, verification_code: "")
  end

  def unverify!
    update!(verified: false, verification_code: "")
  end

  def verifying?
    verification_code_sent?
  end

  def to_s
    formatted.presence || t("to_s", id:)
  end
end
