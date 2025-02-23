# frozen_string_literal: true

class User < ApplicationRecord
  has_many :addresses, dependent: :destroy
  has_many :devices, dependent: :destroy
  has_many :email_addresses, dependent: :destroy
  has_many :handles, dependent: :destroy
  has_many :names, dependent: :destroy
  has_many :passwords, dependent: :destroy
  has_many :phone_numbers, dependent: :destroy
  has_many :programs, dependent: :destroy
  has_many :time_zones, dependent: :destroy
  has_many :tokens, dependent: :destroy
  has_many :sent_messages,
           class_name: "Message",
           foreign_key: :from_user_id,
           dependent: :destroy
  has_many :received_messages,
           class_name: "Message",
           foreign_key: :to_user_id,
           dependent: :destroy

  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }

  accepts_nested_attributes_for :addresses, allow_destroy: true
  accepts_nested_attributes_for :email_addresses, allow_destroy: true
  accepts_nested_attributes_for :handles, allow_destroy: true
  accepts_nested_attributes_for :names, allow_destroy: true
  accepts_nested_attributes_for :passwords, allow_destroy: true
  accepts_nested_attributes_for :phone_numbers, allow_destroy: true
  accepts_nested_attributes_for :time_zones, allow_destroy: true

  validates :locale,
            inclusion: {
              in: I18n.available_locales.map(&:to_s)
            },
            allow_blank: true

  after_create { tokens.create! }

  def name
    names.verified.primary.first&.name || names.verified.first&.name
  end

  def email_address
    email_addresses.verified.primary.first&.email_address ||
      email_addresses.verified.first&.email_address
  end

  def phone_number
    phone_numbers.verified.primary.first&.phone_number ||
      phone_numbers.verified.first&.phone_number
  end

  def time_zone
    email_addresses.verified.primary.first&.email_address ||
      email_addresses.verified.first&.email_address
  end

  def verify!
    update!(verified: true)
  end

  def admin!
    update!(admin: true)
  end

  def unverify!
    update!(verified: false)
  end

  def verified?
    !!verified
  end

  def not_verified?
    !verified?
  end

  def admin?
    !!admin
  end

  def not_admin?
    !admin?
  end

  def to_s
    name.presence || email_address.presence || phone_number.presence ||
      t("to_s", id:)
  end
end
