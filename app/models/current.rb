# frozen_string_literal: true

class Current < ActiveSupport::CurrentAttributes
  resets { Time.zone = nil }

  attribute :user, :time_zone

  def user_or_guest
    user || guest
  end

  def admin?
    (user || guest).admin?
  end

  def time_zone=(time_zone)
    Time.zone = time_zone
    super
  end

  def user!
    user || raise(Code::Error, "no user found")
  end

  def user?
    !!user
  end

  def guest?
    user.blank?
  end

  def guest
    Guest.new
  end

  def registered?
    user.present?
  end

  def email_addresses
    (user || guest).email_addresses.verified
  end

  def email_addresses?
    email_addresses.any?
  end

  def email_addresses!
    unless email_addresses?
      raise(Code::Error, "no verified email addresses found")
    end

    email_addresses
  end

  def email_address
    email_addresses.verified.primary.first || email_addresses.verified.first
  end

  def email_address!
    email_address || raise(Code::Error, "no verified email address found")
  end

  def email_address?
    !!email_address
  end

  def phone_numbers
    (user || guest).phone_numbers.verified
  end

  def phone_numbers?
    phone_numbers.any?
  end

  def phone_numbers!
    raise(Code::Error, "no verified phone numbers found") unless phone_numbers?

    phone_numbers
  end

  def phone_number
    phone_numbers.verified.primary.first || phone_numbers.verified.first
  end

  def phone_number!
    phone_number || raise(Code::Error, "no verified phone number found")
  end

  def phone_number?
    !!phone_number
  end

  def passwords
    (user || guest).passwords
  end

  def passwords!
    raise(Code::Error, "no passwords found") unless passwords?

    passwords
  end

  def passwords?
    passwords.any?
  end

  def password
    passwords.first
  end

  def password!
    password || raise(Code::Error, "no password found")
  end

  def password?
    !!password
  end

  def programs
    (user || guest).programs
  end

  def programs?
    programs.any?
  end

  def programs!
    raise(Code::Error, "no programs found") unless programs?

    programs
  end

  def program
    programs.first
  end

  def program?
    !!program
  end

  def program!
    program || raise(Code::Error, "no program found")
  end

  def schedules
    program&.schedules || Schedule.none
  end

  def schedules?
    schedules.any?
  end

  def schedules!
    raise(Code::Error, "no schedules found") unless schedules?

    schedules
  end

  def schedule
    schedules.first
  end

  def schedule!
    schedule || raise(Code::Error, "no schedule found")
  end

  def schedule?
    !!schedule
  end

  def names
    (user || guest).names.verified
  end

  def names?
    names.any?
  end

  def names!
    raise(Code::Error, "no verified name found") unless names?

    names
  end

  def name
    names.verified.primary.first || names.verified.first
  end

  def name!
    name || raise(Code::Error, "no verified name found")
  end

  def name?
    !!name
  end

  def time_zones
    (user || guest).time_zones.verified
  end

  def time_zones?
    time_zones.any?
  end

  def time_zones!
    raise(Code::Error, "no verified time zone found") unless time_zones?

    time_zones
  end

  def time_zone
    time_zones.verified.primary.first || time_zones.verified.first
  end

  def time_zone!
    time_zone || raise(Code::Error, "no verified time zone found")
  end

  def time_zone?
    !!time_zone
  end
end
