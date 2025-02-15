# frozen_string_literal: true

class Guest
  def self.singular_route_key = :guest
  def self.route_key = :guests

  def id = nil
  def to_model = self
  def model_name = Guest
  def persisted? = false

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

  def name = nil
  def email_address = nil
  def phone_number = nil
  def time_zone = nil
  def verify! = nil
  def admin! = nil
  def unverify! = nil
  def verified? = false
  def not_verified? = true

  def to_signed_global_id(_purpose: nil, _expires_in: nil) = ""
  def signed_id(_purpose: nil, _expires_in: nil) = ""
  def to_s = "guest"
end
