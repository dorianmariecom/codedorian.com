# frozen_string_literal: true

class User < ApplicationRecord
  TIME_ZONES =
    ActiveSupport::TimeZone.all.map(&:tzinfo).map(&:canonical_identifier)

  has_many :data, dependent: :destroy
  has_many :email_addresses, dependent: :destroy
  has_many :passwords, dependent: :destroy
  has_many :phone_numbers, dependent: :destroy
  has_many :programs, dependent: :destroy
  has_many :slack_accounts, dependent: :destroy
  has_many :smtp_accounts, dependent: :destroy
  has_many :twitter_accounts, dependent: :destroy

  accepts_nested_attributes_for(
    :email_addresses,
    reject_if: :all_blank,
    allow_destroy: true
  )
  accepts_nested_attributes_for(
    :passwords,
    reject_if: :all_blank,
    allow_destroy: true
  )
  accepts_nested_attributes_for(
    :phone_numbers,
    reject_if: :all_blank,
    allow_destroy: true
  )
  accepts_nested_attributes_for(
    :slack_accounts,
    reject_if: :all_blank,
    allow_destroy: true
  )
  accepts_nested_attributes_for(
    :smtp_accounts,
    reject_if: :all_blank,
    allow_destroy: true
  )
  accepts_nested_attributes_for(
    :twitter_accounts,
    reject_if: :all_blank,
    allow_destroy: true
  )

  validates :time_zone, inclusion: { in: TIME_ZONES, allow_blank: true }

  def to_s
    name.presence || "User##{id}"
  end
end
