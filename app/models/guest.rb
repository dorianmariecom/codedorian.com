# frozen_string_literal: true

class Guest < ApplicationRecord
  EXPIRATION_DURATION = 1.day

  scope :expired, -> { where(created_at: ..(EXPIRATION_DURATION.ago)) }

  def self.search_fields = base_search_fields

  def addresses = []
  def devices = []
  def email_addresses = []
  def handles = []
  def names = []
  def passwords = []
  def phone_numbers = []
  def time_zones = []
  def tokens = []

  def admin? = false

  def to_s = t("to_s", id: id)
  def to_param = :me
end
