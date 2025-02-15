# frozen_string_literal: true

class Device < ApplicationRecord
  PLATFORMS = %w[ios android].freeze

  belongs_to :user, default: -> { Current.user! }, touch: true

  validate { can!(:update, user) }
  validates :token, presence: true, uniqueness: { scope: :user_id }
  validates :platform, inclusion: { in: PLATFORMS }

  before_validation { log_in(self.user ||= User.create!) }

  def to_s
    platform.presence || t("to_s", id:)
  end
end
