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

  before_validation { self.user ||= Current.user! }
  before_update { not_verified! if name_changed? && verified? }

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

  def name_changed?
    given_name_changed? || family_name_changed?
  end

  def full_name
    [given_name, family_name].compact_blank.join(" ")
  end

  def name
    full_name.presence
  end

  def to_s
    full_name.presence || t("to_s", id: id)
  end
end
