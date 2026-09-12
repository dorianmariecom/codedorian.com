# frozen_string_literal: true

class DeliveryConnection < ApplicationRecord
  PROVIDERS = %w[smtp twilio infobip slack x mastodon reddit].freeze
  scope :twilio, -> { where(provider: "twilio") }
  def twilio? = provider == "twilio"

  belongs_to :user, default: -> { Current.user! }
  scope :where_user, ->(user) { where(user: user) }
  scope :where_admin, -> { joins(:user).where(users: { admin: true }) }
  has_many :delivery_destinations, dependent: :restrict_with_error
  has_many :delivery_channels, dependent: :restrict_with_error
  self.paper_trail_options =
    paper_trail_options.merge(skip: ["encrypted_credentials"])
  validates :name, presence: true
  validates :provider, inclusion: { in: PROVIDERS }
  validate do
    if persisted? &&
         (will_save_change_to_provider? || will_save_change_to_user_id?) &&
         (delivery_destinations.exists? || delivery_channels.exists?)
      errors.add(:provider, :invalid)
    end
  end
  validate { can!(:update, self) }

  def ready?
    required =
      case provider
      when "smtp"
        %w[from smtp_settings]
      when "twilio"
        %w[account_sid auth_token]
      when "infobip"
        %w[api_key base_url sender]
      when "mastodon"
        %w[access_token base_url]
      else
        %w[access_token]
      end
    enabled? && required.all? { |key| credentials[key].present? }
  end

  def credentials
    return {} if encrypted_credentials.blank?

    JSON.parse(encryptor.decrypt_and_verify(encrypted_credentials))
  end

  def credentials=(value)
    parsed = value.is_a?(String) ? JSON.parse(value) : value
    unless parsed.is_a?(Hash)
      raise ArgumentError, "Credentials must be an object"
    end

    self.encrypted_credentials = encryptor.encrypt_and_sign(parsed.to_json)
  end

  def serializable_hash(options = {})
    super((options || {}).merge(except: [:encrypted_credentials]))
  end

  def self.search_fields = base_search_fields
  def to_s = name

  private

  def encryptor
    key =
      Rails.application.key_generator.generate_key(
        "delivery-connections-v1",
        32
      )
    ActiveSupport::MessageEncryptor.new(key, cipher: "aes-256-gcm")
  end
end
