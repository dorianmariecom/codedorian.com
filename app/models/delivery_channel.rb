# frozen_string_literal: true

class DeliveryChannel < ApplicationRecord
  scope :where_user,
        ->(user) do
          where(connection_id: Connection.where_user(user).select(:id))
        end
  scope :where_connection,
        ->(connection) { where(connection_id: connection.id) }
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
  belongs_to :connection, optional: true
  has_many :delivery_destinations, dependent: :destroy
  validates :key, inclusion: { in: KEYS.map(&:to_s) }, uniqueness: true
  validates :amount_cents,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0
            },
            allow_nil: true
  validates :amount_currency, format: { with: /\A[a-z]{3}\z/ }
  normalizes :visibility_restriction,
             :public_pattern,
             :private_pattern,
             with: ->(value) { value.presence }
  validates :visibility_restriction,
            inclusion: {
              in: %w[private public]
            },
            allow_nil: true
  validate :valid_recipient_patterns
  validate :valid_connection

  before_validation do
    if key == "reddit"
      self.visibility_restriction = "private"
      self.show_connection = false
      self.show_visibility = false
      self.show_recipient = true
      self.private_pattern = "(?:u/|@)?[a-zA-Z0-9_-]{3,20}"
      self.connection = nil
    end
  end

  TIMEOUT = 10.minutes
  Result = Data.define(:status, :provider_id)

  class Rejected < StandardError
    attr_reader :code, :retryable

    def initialize(code, retryable: false)
      @code = code.to_s
      @retryable = retryable
      super(@code)
    end
  end

  def deliver(delivery:)
    Current.with(
      delivery: delivery,
      user: delivery.service.user,
      subscription: delivery.subscription,
      locale: delivery.locale
    ) do
      unless delivery.recipient_verified_for_delivery?
        delivery.recipient_unverified!
        return Result.new(status: :canceled, provider_id: nil)
      end
      raise Rejected, "configuration_missing" if delivery_input.blank?

      connection = delivery.connection
      if connection && !connection.enabled?
        raise Rejected, "connection_disabled"
      end

      if PROVIDERS.key?(delivery.channel.to_sym)
        raise Rejected, "configuration_missing" unless connection&.ready?
        unless self.class.supports_provider?(
                 delivery.channel,
                 connection.provider
               )
          raise Rejected, "invalid_connection"
        end
      end
      validate_delivery_urls!(delivery: delivery)

      context =
        Code::Object::Context.new(
          {
            delivery: delivery.to_code,
            delivery_channel: to_code,
            connection: connection.to_code
          }
        )
      value = Code.evaluate(delivery_input, context: context, timeout: TIMEOUT)
      result = value.as_json
      raise IOError, "Invalid delivery result" unless result.is_a?(Hash)

      if result["status"] == "rejected"
        unless result["error_code"].is_a?(String) &&
                 result["error_code"].present? &&
                 [true, false].include?(result["retryable"])
          raise IOError, "Invalid delivery rejection"
        end

        raise Rejected.new(result["error_code"], retryable: result["retryable"])
      end
      unless %w[accepted delivered canceled].include?(result["status"]) &&
               (
                 result["provider_id"].nil? ||
                   result["provider_id"].is_a?(String)
               )
        raise IOError, "Invalid delivery result"
      end

      Result.new(status: result["status"], provider_id: result["provider_id"])
    rescue Rejected => e
      raise unless e.code == "recipient_unverified"

      delivery.recipient_unverified!
      Result.new(status: :canceled, provider_id: nil)
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
      connection&.ready?
  end

  def self.search_fields
    {
      delivery_input: {
        node: -> { arel_table[:delivery_input] },
        type: :string
      },
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
      connection_id: {
        node: -> { arel_table[:connection_id] },
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
      visibility_restriction: {
        node: -> { arel_table[:visibility_restriction] },
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

  def validate_delivery_urls!(delivery:)
    if delivery.channel == "webhook" && !WebhookRecipient.valid?(delivery.recipient)
      raise Rejected, "invalid_webhook_url"
    end
    return unless delivery.channel.in?(%w[apple mastodon])

    origin = URI.parse(delivery.connection.base_url)
    unless origin.is_a?(URI::HTTPS) && origin.host.present? &&
        origin.userinfo.nil? && origin.path.in?(["", "/"]) &&
        origin.query.nil? && origin.fragment.nil?
      raise Rejected, "invalid_provider_origin"
    end
  rescue URI::InvalidURIError
    raise Rejected, "invalid_provider_origin"
  end

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
    return unless connection
    if connection.user.admin? &&
         self.class.supports_provider?(key, connection.provider)
      return
    end

    errors.add(:connection, :invalid)
  end
end
