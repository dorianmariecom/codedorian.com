# frozen_string_literal: true

class Name < ApplicationRecord
  belongs_to :user, default: -> { Current.user! }, touch: true

  scope :primary, -> { where(primary: true) }
  scope :not_primary, -> { where(primary: false) }
  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }

  validates :given_name, presence: true
  validates :family_name, presence: true
  validate { can!(:update, user) }

  before_validation { log_in(self.user ||= User.create!) }
  before_update { unverify! if name_changed? && verified? }

  def unverify!
    update!(verified: false)
  end

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

  def name_changed?
    given_name_changed? || family_name_changed?
  end

  def full_name
    [given_name, family_name].compact_blank.join(" ")
  end

  def to_s
    full_name.presence || "name##{id}"
  end
end
