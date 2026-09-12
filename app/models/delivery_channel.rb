# frozen_string_literal: true

class DeliveryChannel < ApplicationRecord
  KEYS = %w[
    email
    push
    messages
    sms
    whatsapp
    rcs
    apple
    slack
    x
    mastodon
    reddit
  ].freeze
  PROVIDERS = {
    "email" => "smtp",
    "sms" => "twilio",
    "whatsapp" => "twilio",
    "rcs" => "twilio",
    "apple" => "infobip",
    "slack" => "slack",
    "x" => "x",
    "mastodon" => "mastodon",
    "reddit" => "reddit"
  }.freeze
  PERSONAL = %w[slack x mastodon reddit].freeze
  belongs_to :delivery_connection, optional: true
  has_many :delivery_destinations, dependent: :restrict_with_error
  validates :key, inclusion: { in: KEYS }, uniqueness: true
  validates :amount_cents,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0
            },
            allow_nil: true
  validates :amount_currency, format: { with: /\A[a-z]{3}\z/ }
  before_validation do
    if settings.key?("private_delivery_enabled")
      self.settings =
        settings.merge(
          "private_delivery_enabled" =>
            ActiveModel::Type::Boolean.new.cast(
              settings["private_delivery_enabled"]
            )
        )
    end
  end
  validate :valid_connection

  def available?
    return false unless enabled? && amount_cents.present?
    if key.in?(%w[sms whatsapp rcs]) && settings["messaging_service_sid"].blank?
      return false
    end
    if key == "whatsapp" &&
         %w[content_sid_en content_sid_fr].any? do |field|
           settings[field].blank?
         end
      return false
    end

    PERSONAL.include?(key) || %w[push messages].include?(key) ||
      delivery_connection&.ready?
  end

  def self.search_fields = base_search_fields
  def to_s = I18n.t("delivery.channels.#{key}")

  private

  def valid_connection
    return unless delivery_connection
    if delivery_connection.user.admin? &&
         delivery_connection.provider == PROVIDERS[key]
      return
    end

    errors.add(:delivery_connection, :invalid)
  end
end
