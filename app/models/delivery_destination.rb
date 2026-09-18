# frozen_string_literal: true

class DeliveryDestination < ApplicationRecord
  belongs_to :user, default: -> { Current.user! }
  scope :where_user, ->(user) { where(user: user) }
  scope :where_id, ->(ids) { where(id: ids) }
  scope :where_verification_email,
        ->(email) do
          where(
            "LOWER(BTRIM(delivery_destinations.recipient)) = ?",
            email.to_s.strip.downcase
          )
        end
  belongs_to :delivery_channel
  belongs_to :delivery_connection, optional: true
  has_many :subscription_destinations, dependent: :destroy
  has_many :deliveries, dependent: :destroy
  validates :visibility, inclusion: { in: %w[private public] }
  validate do
    if persisted? && will_save_change_to_user_id? &&
         (subscription_destinations.exists? || deliveries.exists?)
      errors.add(:user, :invalid)
    end
  end
  validate do
    if persisted? && will_save_change_to_delivery_channel_id? &&
         subscription_destinations.exists?
      errors.add(:delivery_channel, :invalid)
    end
  end
  validate :valid_destination
  validate { can!(:update, user) }
  before_validation :normalize_visibility
  before_validation :normalize_recipient
  before_validation :inherit_verification

  def verification_email = recipient
  def verification_complete? = recipient_verified?

  def verification_purpose
    [
      :destination_email_confirmation,
      recipient,
      user_id,
      delivery_channel_id,
      updated_at.utc.iso8601(6)
    ]
  end

  def self.find_by_verification(id, token)
    destination =
      joins(:delivery_channel).where(
        delivery_channels: {
          key: "email"
        }
      ).find_by(id: id)
    return unless destination && !destination.recipient_verified?

    if find_signed(token.to_s, purpose: destination.verification_purpose) ==
         destination
      destination
    end
  end

  def request_verification!(url:)
    return if verification_complete?

    EmailVerificationMailer
      .with(locale: I18n.locale)
      .confirmation(email_address: verification_email, url: url)
      .deliver_later
  end

  def verification_token
    signed_id(purpose: verification_purpose, expires_in: 24.hours)
  end

  def inherit_verification
    unless new_record? || will_save_change_to_recipient? ||
             will_save_change_to_user_id? ||
             will_save_change_to_delivery_channel_id?
      return
    end

    self.recipient_verified =
      delivery_channel&.key == "email" &&
        SharedEmailVerification.verified?(
          user_id: user_id,
          email: recipient,
          except_destination: id
        )
  end

  def visibility_public? = visibility == "public"
  def visibility_private? = visibility == "private"

  def channel = delivery_channel.key
  def connection = delivery_connection || delivery_channel.delivery_connection

  def available?
    enabled? && delivery_channel.available? &&
      (!DeliveryChannel::PROVIDERS.key?(channel.to_sym) || connection&.ready?)
  end

  def self.search_fields
    {
      user_id: {
        node: -> { arel_table[:user_id] },
        type: :integer
      },
      delivery_channel_id: {
        node: -> { arel_table[:delivery_channel_id] },
        type: :integer
      },
      delivery_connection_id: {
        node: -> { arel_table[:delivery_connection_id] },
        type: :integer
      },
      recipient: {
        node: -> { arel_table[:recipient] },
        type: :string
      },
      visibility: {
        node: -> { arel_table[:visibility] },
        type: :string
      },
      enabled: {
        node: -> { arel_table[:enabled] },
        type: :boolean
      },
      **base_search_fields
    }
  end

  def to_s
    Utils.join(delivery_channel&.translated_key, recipient)
  end

  def to_code
    {
      id: id,
      user_id: user_id,
      delivery_channel_id: delivery_channel_id,
      delivery_connection_id: delivery_connection_id,
      recipient: recipient,
      visibility: visibility,
      enabled: enabled,
      created_at: created_at,
      updated_at: updated_at
    }.to_code
  end

  private

  def normalize_visibility
    self.visibility = delivery_channel.only if delivery_channel&.only.present?
  end

  def normalize_recipient
    self.recipient = recipient.to_s.strip
    self.recipient = recipient.downcase if delivery_channel&.key == "email"
    return unless delivery_channel&.key.in?(%w[sms whatsapp rcs])

    phone = Phonelib.parse(recipient)
    self.recipient = phone.e164 if phone.valid?
  end

  def valid_destination
    return unless delivery_channel

    if delivery_channel.only.present? && visibility != delivery_channel.only
      errors.add(:visibility, :invalid)
    end
    if delivery_channel.recipient_required?(visibility) && recipient.blank?
      errors.add(:recipient, :blank)
    end
    pattern = delivery_channel.recipient_pattern(visibility)
    if pattern && !Regexp.new("\\A(?:#{pattern})\\z").match?(recipient.to_s)
      errors.add(:recipient, :invalid)
    end
    if channel == "webhook" && !WebhookRecipient.valid?(recipient)
      errors.add(:recipient, :invalid)
    end
    if channel == "email" &&
         !recipient.to_s.match?(EmailAddress::EMAIL_ADDRESS_REGEXP)
      errors.add(:recipient, :invalid)
    end
    if channel.in?(%w[sms whatsapp rcs]) && !Phonelib.parse(recipient).valid?
      errors.add(:recipient, :invalid)
    end
    if DeliveryChannel::PERSONAL.include?(channel.to_sym)
      unless delivery_connection&.user_id == user_id &&
               delivery_connection&.provider ==
                 DeliveryChannel::PROVIDERS[channel.to_sym]&.to_s
        errors.add(:delivery_connection, :invalid)
      end
    elsif delivery_connection
      errors.add(:delivery_connection, :invalid)
    end
  end
end
