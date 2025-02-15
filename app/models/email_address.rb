# frozen_string_literal: true

class EmailAddress < ApplicationRecord
  EMAIL_ADDRESS_REGEXP = URI::MailTo::EMAIL_REGEXP
  VERIFICATION_CODE_PURPOSE = :verification_code
  VERIFICATION_CODE_EXPIRES_IN = 1.hour

  belongs_to :user, default: -> { Current.user! }, touch: true

  scope :primary, -> { where(primary: true) }
  scope :not_primary, -> { where(primary: false) }
  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }

  normalizes(
    :email_address,
    with: ->(email_address) { email_address.to_s.downcase.strip }
  )

  validates :email_address, presence: true
  validates :email_address, format: { with: EMAIL_ADDRESS_REGEXP }
  validate { can!(:update, user) }

  before_validation { log_in(self.user ||= User.create!) }

  before_update do
    unverify! if email_address_changed? && (verified? || verifying?)
  end

  def self.find_verification_code_signed!(id)
    find_signed!(id, purpose: VERIFICATION_CODE_PURPOSE)
  end

  def email_address_with_name
    ActionMailer::Base.email_address_with_name(email_address, user.name)
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

  def verifying?
    verification_code.present?
  end

  def unverify!
    update!(verified: false, verification_code: "")
  end

  def verification_code_signed_id
    signed_id(
      purpose: VERIFICATION_CODE_PURPOSE,
      expires_in: VERIFICATION_CODE_EXPIRES_IN
    )
  end

  def verification_code_sent?
    verification_code.present?
  end

  def reset_verification_code!
    update!(
      verification_code: rand(1_000_000).to_s.rjust(6, "0"),
      verified: false
    )
  end

  def send_verification_code!
    reset_verification_code!

    EmailAddressMailer
      .with(email_address: self)
      .verification_code_email
      .deliver_later
  end

  def verify!(code)
    return if code.blank? || verification_code.blank?

    code = code.gsub(/\D/, "")
    self.verification_code = verification_code.gsub(/\D/, "")
    if code == verification_code
      update!(verified: true, verification_code: "")
    else
      update!(verified: false, verification_code: "")
    end
  end

  def cancel_verification!
    update!(verified: false, verification_code: "")
  end

  def to_s
    email_address.presence || t("to_s", id:)
  end
end
