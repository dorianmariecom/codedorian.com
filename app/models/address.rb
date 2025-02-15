# frozen_string_literal: true

class Address < ApplicationRecord
  belongs_to :user, default: -> { Current.user! }, touch: true

  scope :primary, -> { where(primary: true) }
  scope :not_primary, -> { where(primary: false) }
  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }

  validates :address, presence: true
  validate { can!(:update, user) }

  before_validation { log_in(self.user ||= User.create!) }

  before_update { unverify! if address_changed? && (verified? || verifying?) }

  def primary?
    !!primary
  end

  def not_primary?
    !primary?
  end

  def verified?
    !!verified
  end

  def not_verified?
    !verified?
  end

  def unverify!
    update!(verified: false)
  end

  def to_s
    address.presence || "address##{id}"
  end
end
