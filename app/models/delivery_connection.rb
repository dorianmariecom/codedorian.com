# frozen_string_literal: true

class DeliveryConnection < ApplicationRecord
  PROVIDERS = %i[smtp twilio infobip slack x mastodon reddit].freeze
  scope :twilio, -> { where(provider: :twilio) }

  belongs_to :user, default: -> { Current.user! }
  scope :where_user, ->(user) { where(user: user) }
  scope :where_admin, -> { joins(:user).where(users: { admin: true }) }
  has_many :delivery_destinations, dependent: :nullify
  has_many :delivery_channels, dependent: :nullify
  encrypts :access_token, :auth_token, :api_key, :smtp_password

  validates :name, presence: true
  validates :provider, inclusion: { in: PROVIDERS.map(&:to_s) }
  validate do
    if persisted? &&
         (will_save_change_to_provider? || will_save_change_to_user_id?) &&
         (delivery_destinations.exists? || delivery_channels.exists?)
      errors.add(:provider, :invalid)
    end
  end
  validate { can!(:update, self) }

  def twilio? = provider == "twilio"

  def ready?
    return false unless enabled?

    case provider
    when "smtp"
      smtp_from.present? && smtp_address.present?
    when "twilio"
      account_sid.present? && auth_token.present?
    when "infobip"
      api_key.present? && base_url.present? && sender.present?
    when "mastodon"
      access_token.present? && base_url.present?
    else
      access_token.present?
    end
  end

  def smtp_settings
    {
      address: smtp_address,
      port: smtp_port,
      user_name: smtp_user_name,
      password: smtp_password,
      authentication: smtp_authentication
    }.compact_blank
  end

  def self.search_fields
    {
      user_id: {
        node: -> { arel_table[:user_id] },
        type: :integer
      },
      name: {
        node: -> { arel_table[:name] },
        type: :string
      },
      provider: {
        node: -> { arel_table[:provider] },
        type: :string
      },
      enabled: {
        node: -> { arel_table[:enabled] },
        type: :boolean
      },
      base_url: {
        node: -> { arel_table[:base_url] },
        type: :string
      },
      account_sid: {
        node: -> { arel_table[:account_sid] },
        type: :string
      },
      sender: {
        node: -> { arel_table[:sender] },
        type: :string
      },
      smtp_from: {
        node: -> { arel_table[:smtp_from] },
        type: :string
      },
      smtp_address: {
        node: -> { arel_table[:smtp_address] },
        type: :string
      },
      smtp_port: {
        node: -> { arel_table[:smtp_port] },
        type: :integer
      },
      smtp_user_name: {
        node: -> { arel_table[:smtp_user_name] },
        type: :string
      },
      smtp_authentication: {
        node: -> { arel_table[:smtp_authentication] },
        type: :string
      },
      **base_search_fields
    }
  end

  def to_s = Utils.join(name, id_sample)

  def to_code
    {
      access_token: access_token,
      api_key: api_key,
      auth_token: auth_token,
      smtp_password: smtp_password,
      id: id,
      user_id: user_id,
      name: name,
      provider: provider,
      enabled: enabled,
      base_url: base_url,
      account_sid: account_sid,
      sender: sender,
      smtp_from: smtp_from,
      smtp_address: smtp_address,
      smtp_port: smtp_port,
      smtp_user_name: smtp_user_name,
      smtp_authentication: smtp_authentication,
      created_at: created_at,
      updated_at: updated_at
    }.to_code
  end
end
