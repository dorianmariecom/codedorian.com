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

  def reset_verification_code!
    update!(
      verification_code: rand(1_000_000).to_s.rjust(6, "0"),
      verified: false
    )
  end

  def send_verification_code!
    reset_verification_code!
    query = { api_key:, api_secret:, to: e164, from: BRAND, text: }.to_query
    uri = URI.parse("https://rest.nexmo.com/sms/json?#{query}")
    Net::HTTP.get_response(uri)
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

  def unverify!
    update!(verified: false, verification_code: "")
  end

  def verifying?
    verification_code_sent?
  end

  def api_key
    Rails.application.credentials.rest_nexmo_com.api_key
  end

  def api_secret
    Rails.application.credentials.rest_nexmo_com.api_secret
  end

  def request_id
    nexmo_request_id
  end

  def text
    "your #{ENV.fetch("HOST")} verification code is #{verification_code}"
  end

  def to_s
    formatted.presence || "phone_number##{id}"
  end
end
