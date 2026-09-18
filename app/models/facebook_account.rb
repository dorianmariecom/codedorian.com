# frozen_string_literal: true

class FacebookAccount < ApplicationRecord
  belongs_to :user, default: -> { Current.user! }
  has_many :delivery_destinations, dependent: :nullify
  has_many :deliveries, dependent: :restrict_with_error
  scope :where_user, ->(user) { where(user: user) }
  scope :enabled, -> { where(enabled: true) }
  validates :facebook_id, format: { with: /\A[0-9]+\z/ }, uniqueness: { scope: :user_id }
  validates :name, presence: true
  validates :messenger_status, inclusion: { in: %w[pending ready unavailable] }
  validates :messenger_page_id, :messenger_recipient_id, format: { with: /\A[0-9]+\z/ }, allow_nil: true

  def ready_for?(connection)
    enabled? && messenger_status == "ready" && messenger_recipient_id.present? &&
      connection&.provider == "messenger" && connection.ready? &&
      messenger_page_id == connection.sender && messenger_recipient_id != messenger_page_id
  end

  def refresh_messenger!
    connection = DeliveryChannel.find_by(key: "messenger")&.delivery_connection
    recipient = FacebookOauth.messenger_recipient(facebook_id: facebook_id, connection: connection)
    update!(messenger_page_id: connection.sender, messenger_recipient_id: recipient,
            messenger_status: recipient ? "ready" : "pending")
  rescue FacebookOauth::Error
    update!(messenger_page_id: nil, messenger_recipient_id: nil, messenger_status: "unavailable")
  end

  def to_s = name
end
