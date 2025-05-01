# frozen_string_literal: true

class User < ApplicationRecord
  SHARED_FIELDS = {
    "user:id": {
      node: -> { User.arel_table[:id] },
      relation: ->(scope) { scope.joins(:user) },
      type: :integer
    },
    "user:admin": {
      node: -> { User.arel_table[:admin] },
      relation: ->(scope) { scope.joins(:user) },
      type: :boolean
    },
    "user:verified": {
      node: -> { User.arel_table[:verified] },
      relation: ->(scope) { scope.joins(:user) },
      type: :boolean
    },
    "user:updated_at": {
      node: -> { User.arel_table[:updated_at] },
      relation: ->(scope) { scope.joins(:user) },
      type: :datetime
    },
    "user:created_at": {
      node: -> { User.arel_table[:created_at] },
      relation: ->(scope) { scope.joins(:user) },
      type: :datetime
    }
  }.freeze

  self.fields = {
    id: {
      node: -> { arel_table[:id] },
      type: :integer
    },
    verified: {
      node: -> { arel_table[:verified] },
      type: :boolean
    },
    admin: {
      node: -> { arel_table[:admin] },
      type: :boolean
    },
    updated_at: {
      node: -> { arel_table[:updated_at] },
      type: :datetime
    },
    created_at: {
      node: -> { arel_table[:created_at] },
      type: :datetime
    }
  }

  has_many :addresses, dependent: :destroy
  has_many :devices, dependent: :destroy
  has_many :email_addresses, dependent: :destroy
  has_many :handles, dependent: :destroy
  has_many :names, dependent: :destroy
  has_many :passwords, dependent: :destroy
  has_many :phone_numbers, dependent: :destroy
  has_many :programs, dependent: :destroy
  has_many :repl_sessions, dependent: :destroy
  has_many :time_zones, dependent: :destroy
  has_many :tokens, dependent: :destroy
  has_many :sent_messages,
           class_name: "Message",
           foreign_key: :from_user_id,
           dependent: :destroy,
           inverse_of: :from_user
  has_many :received_messages,
           class_name: "Message",
           foreign_key: :to_user_id,
           dependent: :destroy,
           inverse_of: :to_user

  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }
  scope :admin, -> { where(admin: true) }
  scope :not_admin, -> { where(admin: false) }

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

  def self.verified!
    ApplicationRecord.transaction { find_each(&:verified!) }
  end

  def self.admin!
    ApplicationRecord.transaction { find_each(&:admin!) }
  end

  def self.not_verified!
    ApplicationRecord.transaction { find_each(&:not_verified!) }
  end

  def self.not_admin!
    ApplicationRecord.transaction { find_each(&:not_admin!) }
  end

  def name
    names.verified.primary.first&.name || names.verified.first&.name
  end

  def address
    addresses.verified.primary.first&.address ||
      addresses.verified.first&.address
  end

  def handle
    handles.verified.primary.first&.handle || handles.verified.first&.handle
  end

  def password
    passwords.verified.primary.first&.password ||
      passwords.verified.first&.password
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
    time_zones.verified.primary.first&.time_zone ||
      time_zones.verified.first&.time_zone
  end

  def device
    devices.verified.primary.first&.device || devices.verified.first&.device
  end

  def token
    tokens.verified.primary.first&.token || tokens.verified.first&.token
  end

  def unverified_name
    names.primary.first&.name || names.first&.name
  end

  def unverified_address
    addresses.primary.first&.address || addresses.first&.address
  end

  def unverified_handle
    handles.primary.first&.handle || handles.first&.handle
  end

  def unverified_password
    passwords.primary.first&.password || passwords.first&.password
  end

  def unverified_email_address
    email_addresses.primary.first&.email_address ||
      email_addresses.first&.email_address
  end

  def unverified_phone_number
    phone_numbers.primary.first&.phone_number ||
      phone_numbers.first&.phone_number
  end

  def unverified_time_zone
    time_zones.primary.first&.time_zone || time_zones.first&.time_zone
  end

  def unverified_device
    devices.primary.first&.device || devices.first&.device
  end

  def unverified_token
    tokens.primary.first&.token || tokens.first&.token
  end

  def verified!
    update!(verified: true)
    addresses.update!(verified: true)
    email_addresses.update!(verified: true)
    handles.update!(verified: true)
    names.update!(verified: true)
    passwords.update!(verified: true)
    phone_numbers.update!(verified: true)
    time_zones.update!(verified: true)
    devices.update!(verified: true)
    tokens.update!(verified: true)
  end

  def not_verified!
    update!(verified: false)
    addresses.update!(verified: false)
    email_addresses.update!(verified: false)
    handles.update!(verified: false)
    names.update!(verified: false)
    passwords.update!(verified: false)
    phone_numbers.update!(verified: false)
    time_zones.update!(verified: false)
    devices.update!(verified: false)
    tokens.update!(verified: false)
  end

  def primary!
    addresses.update!(primary: true)
    email_addresses.update!(primary: true)
    handles.update!(primary: true)
    names.update!(primary: true)
    passwords.update!(primary: true)
    phone_numbers.update!(primary: true)
    time_zones.update!(primary: true)
    devices.update!(primary: true)
    tokens.update!(primary: true)
  end

  def not_primary!
    addresses.update!(primary: false)
    email_addresses.update!(primary: false)
    handles.update!(primary: false)
    names.update!(primary: false)
    passwords.update!(primary: false)
    phone_numbers.update!(primary: false)
    time_zones.update!(primary: false)
    devices.update!(primary: false)
    tokens.update!(primary: false)
  end

  def admin!
    update!(admin: true)
  end

  def not_admin!
    update!(admin: false)
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

  def translated_locale
    t("locales.#{locale.presence || "none"}")
  end

  def to_s
    handle.presence || name.presence || email_address.presence ||
      phone_number.presence || address.presence || device.presence ||
      token.presence || t("to_s", id: id)
  end

  def to_unverified_s
    unverified_handle.presence || unverified_name.presence ||
      unverified_email_address.presence || unverified_phone_number.presence ||
      unverified_address.presence || unverified_device.presence ||
      unverified_token.presence || t("to_s", id: id)
  end

  def to_code
    Code::Object::User.new(id: id)
  end
end
