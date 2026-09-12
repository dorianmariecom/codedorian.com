# frozen_string_literal: true

class DeliveryDestination < ApplicationRecord
  belongs_to :user, default: -> { Current.user! }
  scope :where_user, ->(user) { where(user: user) }
  scope :where_id, ->(ids) { where(id: ids) }
  belongs_to :delivery_channel
  belongs_to :delivery_connection, optional: true
  has_many :subscription_destinations, dependent: :restrict_with_error
  has_many :deliveries, dependent: :restrict_with_error
  validates :name, presence: true
  validates :visibility, inclusion: { in: %w[private public] }
  validate do
    if persisted? && will_save_change_to_user_id? &&
         (subscription_destinations.exists? || deliveries.exists?)
      errors.add(:user, :invalid)
    end
  end
  validate :valid_destination
  validate { can!(:update, user) }
  before_validation :normalize_recipient
  before_validation :normalize_name

  def public? = visibility == "public"

  def channel = delivery_channel.key
  def connection = delivery_connection || delivery_channel.delivery_connection

  def available?
    enabled? && delivery_channel.available? &&
      (connection.nil? || connection.ready?)
  end

  def self.search_fields = base_search_fields

  def to_s
    [delivery_channel, recipient].compact_blank.join(" · ").presence || name
  end

  def snapshot
    {
      "channel" => channel,
      "recipient" => recipient,
      "visibility" => visibility,
      "settings" => settings,
      "connection_id" => connection&.id,
      "user_id" => user_id
    }
  end

  private

  def normalize_recipient
    self.recipient = recipient.to_s.strip
    self.recipient = recipient.downcase if delivery_channel&.key == "email"
    return unless delivery_channel&.key.in?(%w[sms whatsapp rcs])

    phone = Phonelib.parse(recipient)
    self.recipient = phone.e164 if phone.valid?
  end

  def normalize_name
    return if name.present?

    channel_name = delivery_channel&.to_s
    self.name =
      if recipient.present?
        [channel_name, recipient].compact_blank.join(" · ")
      else
        channel_name.presence || "destination"
      end
  end

  def valid_destination
    return unless delivery_channel

    if visibility == "public" && !channel.in?(%w[x mastodon reddit])
      errors.add(:visibility, :invalid)
    end
    if delivery_channel.show_recipient && recipient.blank? &&
         !(visibility == "public" && channel.in?(%w[x mastodon]))
      errors.add(:recipient, :blank)
    end
    if channel == "email" &&
         !recipient.to_s.match?(EmailAddress::EMAIL_ADDRESS_REGEXP)
      errors.add(:recipient, :invalid)
    end
    if channel.in?(%w[sms whatsapp rcs]) && !Phonelib.parse(recipient).valid?
      errors.add(:recipient, :invalid)
    end
    if DeliveryChannel::PERSONAL.include?(channel)
      unless delivery_connection&.user_id == user_id &&
               delivery_connection&.provider ==
                 DeliveryChannel::PROVIDERS[channel]
        errors.add(:delivery_connection, :invalid)
      end
    elsif delivery_connection
      errors.add(:delivery_connection, :invalid)
    end
    if channel == "reddit" && visibility == "private" &&
         delivery_channel.settings["private_delivery_enabled"] != true
      errors.add(:visibility, :invalid)
    end
  end
end
