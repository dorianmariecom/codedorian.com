# frozen_string_literal: true

class Token < ApplicationRecord
  belongs_to :user, default: -> { Current.user! }, touch: true

  scope :primary, -> { where(primary: true) }
  scope :not_primary, -> { where(primary: false) }
  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }

  validates :token, presence: true
  validate { can!(:update, user) }

  after_initialize { self.token ||= SecureRandom.hex }
  before_validation { log_in(self.user ||= User.create!) }

  before_update { not_verified! if token_changed? && verified? }

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
    token.presence || t("to_s", id:)
  end
end
