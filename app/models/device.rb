# frozen_string_literal: true

class Device < ApplicationRecord
  PLATFORMS = %w[ios android].freeze

  belongs_to(:user, default: -> { Current.user! }, touch: true)

  scope(:primary, -> { where(primary: true) })
  scope(:not_primary, -> { where(primary: false) })
  scope(:verified, -> { where(verified: true) })
  scope(:not_verified, -> { where(verified: false) })
  scope(:where_user, ->(user) { where(user: user) })

  validate { can!(:update, user) }
  validates(:token, presence: true, uniqueness: { scope: :user_id })
  validates(:platform, inclusion: { in: PLATFORMS })

  before_validation { self.user ||= Current.user! }

  before_update { not_verified! if device_changed? && verified? }

  def self.search_fields
    {
      platform: {
        node: -> { arel_table[:platform] },
        type: :string
      },
      token: {
        node: -> { arel_table[:token] },
        type: :string
      },
      primary: {
        node: -> { arel_table[:primary] },
        type: :boolean
      },
      verified: {
        node: -> { arel_table[:verified] },
        type: :boolean
      },
      **base_search_fields,
      **User.associated_search_fields
    }
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

  def platform_sample
    Truncate.strip(platform)
  end

  def user_sample
    Truncate.strip(user)
  end

  def to_s
    Utils.join(platform_sample.presence || user_sample, id_sample).presence ||
      t("to_s", id:)
  end

  def to_code
    Code::Object::Device.new(
      id: id,
      created_at: created_at,
      platform: platform,
      primary: primary,
      token: token,
      updated_at: updated_at,
      user_id: user_id,
      verified: verified
    )
  end
end
