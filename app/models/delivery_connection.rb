# frozen_string_literal: true

class DeliveryConnection < ApplicationRecord
  PROVIDERS = %i[
    google
    github
    smtp
    twilio
    infobip
    slack
    x
    mastodon
    reddit
    facebook
    messenger
    instagram
    telegram
    viber
    gmail
    google_workspace
    outlook
    aws_ses
    sendgrid
    resend
    mailgun
    mailchimp
  ].freeze
  ADMIN_PROVIDERS = %w[
    reddit
    facebook
    messenger
    instagram
    telegram
    viber
    gmail
    google_workspace
    outlook
    aws_ses
    sendgrid
    resend
    mailgun
    mailchimp
  ].freeze
  scope :where_provider, ->(provider) { where(provider: provider) }
  scope :twilio, -> { where(provider: :twilio) }

  belongs_to :user, default: -> { Current.user! }
  scope :where_user, ->(user) { where(user: user) }
  scope :where_admin, -> { joins(:user).where(users: { admin: true }) }
  has_many :delivery_destinations, dependent: :nullify
  has_many :delivery_channels, dependent: :nullify
  encrypts :refresh_token,
           :access_token,
           :auth_token,
           :api_key,
           :smtp_password,
           :aws_secret_access_key,
           :aws_session_token

  validates :aws_region,
            format: {
              with: /\A[a-z]{2}(?:-gov)?-[a-z]+-\d\z/
            },
            allow_blank: true
  validates :mailgun_region, inclusion: { in: %w[us eu] }, allow_blank: true
  validates :mailgun_domain,
            format: {
              with: /\A[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\z/
            },
            allow_blank: true
  validate do
    if provider.in?(ADMIN_PROVIDERS) && !user&.admin?
      errors.add(:user, :invalid)
    end
  end

  validates :provider, inclusion: { in: PROVIDERS.map(&:to_s) }
  validate do
    if persisted? &&
         (will_save_change_to_provider? || will_save_change_to_user_id?) &&
         (delivery_destinations.exists? || delivery_channels.exists?)
      errors.add(:provider, :invalid)
    end
  end
  validate { can!(:save_credentials, self) }

  def calendar_access?
    return false unless provider.in?(%w[google gmail google_workspace])

    granted = scope.to_s.split
    (MailboxOauth::GOOGLE_CALENDAR_SCOPES - granted).empty? ||
      granted.include?("https://www.googleapis.com/auth/calendar.readonly") ||
      granted.include?("https://www.googleapis.com/auth/calendar")
  end

  def refresh_credentials_for_code!
    case provider
    when "x"
      XOauth.access_token_for(self)
    when "github"
      GithubOauth.access_token_for(self)
    when "google", "gmail", "google_workspace", "outlook"
      MailboxOauth.new(provider).access_token_for(self)
    end
    self
  end

  def twilio? = provider == "twilio"

  def ready?
    return false unless enabled?
    return false if provider.in?(ADMIN_PROVIDERS) && !user&.admin?

    case provider
    when "smtp"
      smtp_from.present? && smtp_address.present?
    when "twilio"
      account_sid.present? && auth_token.present?
    when "infobip"
      api_key.present? && base_url.present? && sender.present?
    when "google"
      calendar_access? && access_token.present? && refresh_token.present?
    when "gmail", "google_workspace", "outlook"
      smtp_from.present? && access_token.present? && refresh_token.present?
    when "aws_ses"
      smtp_from.present? && aws_access_key_id.present? &&
        aws_secret_access_key.present? && aws_region.present?
    when "sendgrid", "resend", "mailchimp"
      smtp_from.present? && api_key.present?
    when "mailgun"
      smtp_from.present? && api_key.present? && mailgun_domain.present? &&
        mailgun_region.in?(%w[us eu])
    when "facebook"
      access_token.present? && sender.to_s.match?(/\A[0-9]+\z/)
    when "messenger", "instagram", "viber"
      access_token.present? && sender.present?
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
      email: {
        node: -> { arel_table[:email] },
        type: :string
      },
      username: {
        node: -> { arel_table[:username] },
        type: :string
      },
      external_id: {
        node: -> { arel_table[:external_id] },
        type: :string
      },
      provider: {
        node: -> { arel_table[:provider] },
        type: :string
      },
      scope: {
        node: -> { arel_table[:scope] },
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
      aws_access_key_id: {
        node: -> { arel_table[:aws_access_key_id] },
        type: :string
      },
      aws_region: {
        node: -> { arel_table[:aws_region] },
        type: :string
      },
      mailgun_domain: {
        node: -> { arel_table[:mailgun_domain] },
        type: :string
      },
      mailgun_region: {
        node: -> { arel_table[:mailgun_region] },
        type: :string
      },
      **base_search_fields
    }
  end

  def to_s
    Utils.join(*[provider, email, username, external_id, id_sample].uniq)
  end

  def to_code
    Pundit.policy_scope!(Current.user, DeliveryConnection).find(id)
    refresh_credentials_for_code! if enabled?
    Code::Object::DeliveryConnection.new(attributes)
  rescue *DeliveryConnectionOauth::ERRORS => e
    raise Code::Error, e.code
  end
end
