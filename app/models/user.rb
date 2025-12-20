# frozen_string_literal: true

class User < ApplicationRecord
  has_many(:addresses, dependent: :destroy)
  has_many(:attachments, dependent: :destroy)
  has_many(:data, dependent: :destroy)
  has_many(:devices, dependent: :destroy)
  has_many(:email_addresses, dependent: :destroy)
  has_many(:handles, dependent: :destroy)
  has_many(:names, dependent: :destroy)
  has_many(:passwords, dependent: :destroy)
  has_many(:phone_numbers, dependent: :destroy)
  has_many(:program_prompts, dependent: :destroy)
  has_many(:program_prompts_schedules, through: :program_prompts)
  has_many(:programs, dependent: :destroy)
  has_many(:programs_executions, through: :programs)
  has_many(:repl_prompts, dependent: :destroy)
  has_many(:repl_sessions, dependent: :destroy)
  has_many(:repl_programs, through: :repl_sessions)
  has_many(:time_zones, dependent: :destroy)
  has_many(:tokens, dependent: :destroy)
  has_many(
    :sent_messages,
    class_name: "Message",
    foreign_key: :from_user_id,
    dependent: :destroy,
    inverse_of: :from_user
  )
  has_many(
    :received_messages,
    class_name: "Message",
    foreign_key: :to_user_id,
    dependent: :destroy,
    inverse_of: :to_user
  )

  scope(:verified, -> { where(verified: true) })
  scope(:not_verified, -> { where(verified: false) })
  scope(:admin, -> { where(admin: true) })
  scope(:not_admin, -> { where(admin: false) })

  accepts_nested_attributes_for(:addresses, allow_destroy: true)
  accepts_nested_attributes_for(:email_addresses, allow_destroy: true)
  accepts_nested_attributes_for(:handles, allow_destroy: true)
  accepts_nested_attributes_for(:names, allow_destroy: true)
  accepts_nested_attributes_for(:passwords, allow_destroy: true)
  accepts_nested_attributes_for(:phone_numbers, allow_destroy: true)
  accepts_nested_attributes_for(:time_zones, allow_destroy: true)

  validates(
    :locale,
    inclusion: {
      in: I18n.available_locales.map(&:to_s)
    },
    allow_blank: true
  )

  after_save :update_description
  after_touch :update_description

  def self.associated_search_fields
    {
      "user:id": {
        node: -> { User.arel_table[:id] },
        relation: ->(scope) { scope.left_joins(:user) },
        type: :integer
      },
      "user:description": {
        node: -> { User.arel_table[:description] },
        relation: ->(scope) { scope.left_joins(:user) },
        type: :string
      },
      "user:admin": {
        node: -> { User.arel_table[:admin] },
        relation: ->(scope) { scope.left_joins(:user) },
        type: :boolean
      },
      "user:verified": {
        node: -> { User.arel_table[:verified] },
        relation: ->(scope) { scope.left_joins(:user) },
        type: :boolean
      },
      "user:updated_at": {
        node: -> { User.arel_table[:updated_at] },
        relation: ->(scope) { scope.left_joins(:user) },
        type: :datetime
      },
      "user:created_at": {
        node: -> { User.arel_table[:created_at] },
        relation: ->(scope) { scope.left_joins(:user) },
        type: :datetime
      }
    }
  end

  def self.search_fields
    {
      verified: {
        node: -> { arel_table[:verified] },
        type: :boolean
      },
      admin: {
        node: -> { arel_table[:admin] },
        type: :boolean
      },
      **base_search_fields
    }
  end

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
    if association(:names).loaded?
      names
        .select(&:verified)
        .sort_by { |n| n.primary ? 0 : 1 }
        .first
        &.name
    else
      names.verified.order(primary: :desc).first&.name
    end
  end

  def address
    if association(:addresses).loaded?
      addresses
        .select(&:verified)
        .sort_by { |a| a.primary ? 0 : 1 }
        .first
        &.address
    else
      addresses.verified.order(primary: :desc).first&.address
    end
  end

  def handle
    if association(:handles).loaded?
      handles
        .select(&:verified)
        .sort_by { |h| h.primary ? 0 : 1 }
        .first
        &.handle
    else
      handles.verified.order(primary: :desc).first&.handle
    end
  end

  def password
    if association(:passwords).loaded?
      passwords
        .select(&:verified)
        .sort_by { |p| p.primary ? 0 : 1 }
        .first
        &.password
    else
      passwords.verified.order(primary: :desc).first&.password
    end
  end

  def email_address
    if association(:email_addresses).loaded?
      email_addresses
        .select(&:verified)
        .sort_by { |e| e.primary ? 0 : 1 }
        .first
        &.email_address
    else
      email_addresses.verified.order(primary: :desc).first&.email_address
    end
  end

  def phone_number
    if association(:phone_numbers).loaded?
      phone_numbers
        .select(&:verified)
        .sort_by { |p| p.primary ? 0 : 1 }
        .first
        &.phone_number
    else
      phone_numbers.verified.order(primary: :desc).first&.phone_number
    end
  end

  def time_zone
    return @time_zone if defined?(@time_zone)

    @time_zone =
      if association(:time_zones).loaded?
        time_zones
          .select(&:verified)
          .sort_by { |tz| tz.primary ? 0 : 1 }
          .first
          &.time_zone
      else
        time_zones.verified.order(primary: :desc).first&.time_zone
      end
  end

  def unverified_time_zone
    if association(:time_zones).loaded?
      time_zones.sort_by { |tz| tz.primary ? 0 : 1 }.first&.time_zone
    else
      time_zones.order(primary: :desc).first&.time_zone
    end
  end

  def device
    if association(:devices).loaded?
      devices
        .select(&:verified)
        .sort_by { |d| d.primary ? 0 : 1 }
        .first
        &.device
    else
      devices.verified.order(primary: :desc).first&.device
    end
  end

  def unverified_device
    if association(:devices).loaded?
      devices.sort_by { |d| d.primary ? 0 : 1 }.first&.device
    else
      devices.order(primary: :desc).first&.device
    end
  end

  def token
    if association(:tokens).loaded?
      tokens
        .select(&:verified)
        .sort_by { |t| t.primary ? 0 : 1 }
        .first
        &.token
    else
      tokens.verified.order(primary: :desc).first&.token
    end
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
    description.presence || t("to_s", id: id)
  end

  def calculated_description
    handle.presence || name.presence || email_address.presence ||
      phone_number.presence || address.presence || device.presence ||
      token.presence
  end

  def description_changed?
    description != calculated_description
  end

  def update_description
    update!(description: calculated_description) if description_changed?
  end

  def to_code
    Code::Object::User.new(
      id: id,
      admin?: admin?,
      verified?: verified?,
      locale: locale,
      translated_locale: translated_locale,
      description: description,
      updated_at: updated_at,
      created_at: created_at,
      programs: programs.includes(:program_schedules)
    )
  end
end
