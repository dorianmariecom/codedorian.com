# frozen_string_literal: true

class EmailAddress < ApplicationRecord
  EMAIL_ADDRESS_REGEXP = URI::MailTo::EMAIL_REGEXP

  belongs_to :user, default: -> { Current.user! }, touch: true

  scope :primary, -> { where(primary: true) }
  scope :not_primary, -> { where(primary: false) }
  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }

  normalizes(
    :email_address,
    with: ->(email_address) { email_address.to_s.downcase.strip }
  )

  validates :email_address, presence: true
  validates :email_address, format: { with: EMAIL_ADDRESS_REGEXP }
  validate { can!(:update, user) }

  before_validation { log_in(self.user ||= User.create!) }

  before_update { not_verified! if email_address_changed? && verified? }

  def email_address_with_name
    ActionMailer::Base.email_address_with_name(email_address, user.name)
  end

  def primary?
    !!primary
  end

  def not_primary?
    !primary?
  end

  def primary!
    update!(primary: true)
  end

  def not_primary!
    update!(primary: false)
  end

  def verified?
    !!verified
  end

  def not_verified?
    !verified?
  end

  def verified!
    update!(verified: true)
  end

  def not_verified!
    update!(verified: false)
  end

  def to_s
    email_address.presence || t("to_s", id:)
  end
end
