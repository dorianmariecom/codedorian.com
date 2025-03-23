# frozen_string_literal: true

class Device < ApplicationRecord
  PLATFORMS = %w[ios android].freeze

  belongs_to :user, default: -> { Current.user! }, touch: true

  scope :primary, -> { where(primary: true) }
  scope :not_primary, -> { where(primary: false) }
  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }

  validate { can!(:update, user) }
  validates :token, presence: true, uniqueness: { scope: :user_id }
  validates :platform, inclusion: { in: PLATFORMS }

  before_validation { log_in(self.user ||= User.create!) }

  before_update { not_verified! if device_changed? && verified? }

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

  def device_changed?
    platform_changed? || token_changed?
  end

  def ios?
    platform == "ios"
  end

  def android?
    platform == "android"
  end

  def device
    platform.presence
  end

  def to_s
    platform.presence || t("to_s", id:)
  end
end
