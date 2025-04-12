# frozen_string_literal: true

class TimeZone < ApplicationRecord
  TIME_ZONES =
    ActiveSupport::TimeZone.all.map do |time_zone|
      time_zone.tzinfo.canonical_identifier
    end

  belongs_to :user, default: -> { Current.user! }, touch: true

  scope :primary, -> { where(primary: true) }
  scope :not_primary, -> { where(primary: false) }
  scope :verified, -> { where(verified: true) }
  scope :not_verified, -> { where(verified: false) }

  validates :time_zone, inclusion: { in: TIME_ZONES, allow_blank: true }
  validate { can!(:update, user) }

  before_validation { self.user ||= Current.user! }

  before_update { not_verified! if time_zone_changed? && verified? }

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
    time_zone.presence || t("to_s", id: id)
  end
end
