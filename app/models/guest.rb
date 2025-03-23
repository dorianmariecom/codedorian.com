# frozen_string_literal: true

class Guest
  include ActiveModel::Model

  def self.singular_route_key = :guest
  def self.route_key = :guests

  def id = "me"
  def to_param = "me"
  def to_model = self
  def model_name = ActiveModel::Name.new(self.class, nil, "Guest")
  def to_partial_path = "guests/guest"
  def persisted? = true

  def addresses = Address.none
  def devices = Device.none
  def email_addresses = EmailAddress.none
  def handles = Handle.none
  def names = Name.none
  def passwords = Password.none
  def phone_numbers = PhoneNumber.none
  def programs = Program.none
  def time_zones = TimeZone.none
  def tokens = Token.none
  def sent_messages = Message.none
  def received_messages = Message.none

  def verified! = nil
  def primary! = nil
  def admin! = nil
  def not_verified! = nil
  def not_primary! = nil

  def locale = I18n.locale.to_s
  def updated_at = Time.zone.now
  def created_at = Time.zone.now
  def device = nil
  def token = nil
  def name = nil
  def address = nil
  def handle = nil
  def password = nil
  def email_address = nil
  def phone_number = nil
  def time_zone = nil
  def verified? = false
  def not_verified? = true
  def admin? = false
  def not_admin? = true
  def admin = false
  def verified = false

  def translated_locale
    I18n.t("guests.model.locales.#{locale.presence || "none"}")
  end

  def to_signed_global_id(_purpose: nil, _expires_in: nil) = ""
  def signed_id(_purpose: nil, _expires_in: nil) = ""
  def to_s = I18n.t("guests.model.to_s")
end
