# frozen_string_literal: true

class DeliveryChannel < ApplicationRecord
  KEYS = %i[
    email
    facebook
    messenger
    instagram
    telegram
    viber
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
    webhook
  ].freeze
  PROVIDERS = {
    email: %i[smtp gmail google_workspace outlook aws_ses sendgrid resend mailgun mailchimp],
    facebook: :facebook,
    messenger: :messenger,
    instagram: :instagram,
    telegram: :telegram,
    viber: :viber,
    sms: :twilio,
    whatsapp: :twilio,
    rcs: :twilio,
    apple: :infobip,
    slack: :slack,
    x: :x,
    mastodon: :mastodon,
    reddit: :reddit
  }.freeze
  def self.supports_provider?(key, provider)
    Array(PROVIDERS[key.to_s.to_sym]).map(&:to_s).include?(provider.to_s)
  end

  PERSONAL = %i[slack x mastodon reddit].freeze
  belongs_to :delivery_connection, optional: true
  has_many :delivery_destinations, dependent: :destroy
  validates :key, inclusion: { in: KEYS.map(&:to_s) }, uniqueness: true
  validates :amount_cents,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0
            },
            allow_nil: true
  validates :amount_currency, format: { with: /\A[a-z]{3}\z/ }
  validate :valid_connection

  def available?
    return false unless enabled? && amount_cents.present?
    if key.in?(%w[sms whatsapp rcs]) && messaging_service_sid.blank?
      return false
    end
    if key == "whatsapp" && (content_sid_en.blank? || content_sid_fr.blank?)
      return false
    end

    PERSONAL.include?(key.to_sym) || %w[push messages webhook].include?(key) ||
      delivery_connection&.ready?
  end

  def self.search_fields
    {
      key: {
        node: -> { arel_table[:key] },
        type: :string
      },
      enabled: {
        node: -> { arel_table[:enabled] },
        type: :boolean
      },
      amount_cents: {
        node: -> { arel_table[:amount_cents] },
        type: :integer
      },
      amount_currency: {
        node: -> { arel_table[:amount_currency] },
        type: :string
      },
      delivery_connection_id: {
        node: -> { arel_table[:delivery_connection_id] },
        type: :integer
      },
      messaging_service_sid: {
        node: -> { arel_table[:messaging_service_sid] },
        type: :string
      },
      content_sid_en: {
        node: -> { arel_table[:content_sid_en] },
        type: :string
      },
      content_sid_fr: {
        node: -> { arel_table[:content_sid_fr] },
        type: :string
      },
      callback_base_url: {
        node: -> { arel_table[:callback_base_url] },
        type: :string
      },
      private_delivery_enabled: {
        node: -> { arel_table[:private_delivery_enabled] },
        type: :boolean
      },
      show_recipient: {
        node: -> { arel_table[:show_recipient] },
        type: :boolean
      },
      show_visibility: {
        node: -> { arel_table[:show_visibility] },
        type: :boolean
      },
      **base_search_fields
    }
  end

  def translated_key = t("keys.#{key}")

  def to_s = Utils.join(translated_key, id_sample)

  def to_code
    {
      id: id,
      key: key,
      enabled: enabled,
      amount_cents: amount_cents,
      amount_currency: amount_currency,
      delivery_connection_id: delivery_connection_id,
      messaging_service_sid: messaging_service_sid,
      content_sid_en: content_sid_en,
      content_sid_fr: content_sid_fr,
      callback_base_url: callback_base_url,
      private_delivery_enabled: private_delivery_enabled,
      show_recipient: show_recipient,
      show_visibility: show_visibility,
      created_at: created_at,
      updated_at: updated_at
    }.to_code
  end

  private

  def valid_connection
    return unless delivery_connection
    if delivery_connection.user.admin? &&
         self.class.supports_provider?(key, delivery_connection.provider)
      return
    end

    errors.add(:delivery_connection, :invalid)
  end
end
