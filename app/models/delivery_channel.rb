# frozen_string_literal: true

class DeliveryChannel < ApplicationRecord
  KEYS = %i[
    github
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
    github: :github,
    email: %i[
      smtp
      gmail
      google_workspace
      outlook
      aws_ses
      sendgrid
      resend
      mailgun
      mailchimp
    ],
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
    mastodon: :mastodon
  }.freeze
  def self.supports_provider?(key, provider)
    Array(PROVIDERS[key.to_s.to_sym]).map(&:to_s).include?(provider.to_s)
  end

  PERSONAL = %i[github slack x mastodon].freeze
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
  normalizes :only,
             :public_pattern,
             :private_pattern,
             with: ->(value) { value.presence }
  validates :only, inclusion: { in: %w[private public] }, allow_nil: true
  validate :valid_recipient_patterns
  validate :valid_connection

  before_validation do
    if key == "reddit"
      self.only = "private"
      self.show_connection = false
      self.show_visibility = false
      self.show_recipient = true
      self.private_pattern = "(?:u/|@)?[a-zA-Z0-9_-]{3,20}"
      self.delivery_connection = nil
    end
  end

  def available?
    return false unless enabled? && amount_cents.present?
    return RedditScript.configured? if key == "reddit"
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
      only: {
        node: -> { arel_table[:only] },
        type: :string
      },
      public_pattern: {
        node: -> { arel_table[:public_pattern] },
        type: :string
      },
      private_pattern: {
        node: -> { arel_table[:private_pattern] },
        type: :string
      },
      show_connection: {
        node: -> { arel_table[:show_connection] },
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

  def recipient_pattern(visibility)
    visibility == "public" ? public_pattern : private_pattern
  end

  def recipient_required?(visibility)
    return false unless show_recipient?

    pattern = recipient_pattern(visibility)
    pattern.nil? || !Regexp.new("\\A(?:#{pattern})\\z").match?("")
  end

  def translated_key = t("keys.#{key}")

  def to_s = Utils.join(translated_key, id_sample)

  def to_code
    Code::Object::DeliveryChannel.new(attributes)
  end

  private

  def valid_recipient_patterns
    {
      public_pattern: public_pattern,
      private_pattern: private_pattern
    }.each do |attribute, pattern|
      Regexp.new("\\A(?:#{pattern})\\z") if pattern
    rescue RegexpError
      errors.add(attribute, :invalid)
    end
  end

  def valid_connection
    return unless delivery_connection
    if delivery_connection.user.admin? &&
         self.class.supports_provider?(key, delivery_connection.provider)
      return
    end

    errors.add(:delivery_connection, :invalid)
  end
end
