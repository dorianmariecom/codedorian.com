# frozen_string_literal: true

class DeliveryDestination < ApplicationRecord
  belongs_to :user, default: -> { Current.user! }
  scope :where_user, ->(user) { where(user: user) }
  scope :where_id, ->(ids) { where(id: ids) }
  belongs_to :delivery_channel
  belongs_to :delivery_connection, optional: true
  has_many :subscription_destinations, dependent: :destroy
  has_many :deliveries, dependent: :destroy
  validates :name, presence: true
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
  before_validation :normalize_recipient
  before_validation :normalize_name

  def visibility_public? = visibility == "public"
  def visibility_private? = visibility == "private"

  def channel = delivery_channel.key
  def connection = delivery_connection || delivery_channel.delivery_connection

  def available?
    enabled? && delivery_channel.available? &&
      (connection.nil? || connection.ready?)
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
      name: {
        node: -> { arel_table[:name] },
        type: :string
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
    Utils.join(delivery_channel, recipient, name, id_sample)
  end

  def to_code
    {
      id: id,
      user_id: user_id,
      delivery_channel_id: delivery_channel_id,
      delivery_connection_id: delivery_connection_id,
      name: name,
      recipient: recipient,
      visibility: visibility,
      enabled: enabled,
      created_at: created_at,
      updated_at: updated_at
    }.to_code
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

    channel_name = delivery_channel&.translated_key
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
    if DeliveryChannel::PERSONAL.include?(channel.to_sym)
      unless delivery_connection&.user_id == user_id &&
               delivery_connection&.provider ==
                 DeliveryChannel::PROVIDERS[channel.to_sym]&.to_s
        errors.add(:delivery_connection, :invalid)
      end
    elsif delivery_connection
      errors.add(:delivery_connection, :invalid)
    end
    if channel == "reddit" && visibility == "private" &&
         !delivery_channel.private_delivery_enabled?
      errors.add(:visibility, :invalid)
    end
  end
end
