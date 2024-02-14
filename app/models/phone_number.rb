class PhoneNumber < ApplicationRecord
  DEFAULT_COUNTRY_CODE = "FR"

  belongs_to :user, default: -> { Current.user }

  scope :primary, -> { where(primary: true) }
  scope :not_primary, -> { where(primary: false) }
  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }

  validates :phone_number, phone: true

  def formatted_phone_number
    Phonelib.parse(phone_number).international
  end

  def to_s
    formatted_phone_number.presence || "PhoneNumber##{id}"
  end
end
