# frozen_string_literal: true

class Token < ApplicationRecord
  belongs_to :user, default: -> { Current.user! }, touch: true

  validates :token, presence: true
  validate { can!(:update, user) }

  after_initialize { self.token ||= SecureRandom.hex }
  before_validation { log_in(self.user ||= User.create!) }

  def to_s
    token.presence || "token##{id}"
  end
end
