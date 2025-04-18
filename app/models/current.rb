# frozen_string_literal: true

class Current < ActiveSupport::CurrentAttributes
  PRODUCTION = "production"
  DEFAULT_HOST = "codedorian.com"
  DEFAULT_BASE_URL = "https://codedorian.com"
  DEFAULT_HOSTS = DEFAULT_HOST
  DEFAULT_BG_ENV = "bg-production"
  BG_ENVS = {
    test: "bg-test",
    localhost: "bg-localhost",
    development: "bg-development",
    staging: "bg-staging",
    production: "bg-production"
  }.freeze
  DEFAULT_TEXT_ENV = "text-production"
  TEXT_ENVS = {
    test: "text-test",
    localhost: "text-localhost",
    development: "text-development",
    staging: "text-staging",
    production: "text-production"
  }.freeze
  DEFAULT_BORDER_ENV = "border-production"
  BORDER_ENVS = {
    test: "border-test",
    localhost: "border-localhost",
    development: "border-development",
    staging: "border-staging",
    production: "border-production"
  }.freeze
  DEFAULT_IOS_APP_NAME = "codedorian"
  IOS_APP_NAME = {
    test: "test",
    localhost: "localhost",
    development: "development",
    staging: "staging",
    production: "codedorian"
  }.freeze
  DEFAULT_ANDROID_APP_NAME = "codedorian"
  ANDROID_APP_NAME = {
    test: "test",
    localhost: "localhost",
    development: "development",
    staging: "staging",
    production: "codedorian"
  }.freeze

  LOCALHOST_PUBLIC_SUFFIX = { sld: nil, tld: :localhost, trd: nil }.to_struct

  resets { Time.zone = nil }

  attribute :user, :time_zone, :request

  def ios_environment
    PRODUCTION
  end

  def android_environment
    PRODUCTION
  end

  def ios_app_name
    IOS_APP_NAME.fetch(env, DEFAULT_IOS_APP_NAME)
  end

  def android_app_name
    ANDROID_APP_NAME.fetch(env, DEFAULT_ANDROID_APP_NAME)
  end

  def request?
    !!request
  end

  def host
    request? ? request.host : ENV.fetch("HOST", DEFAULT_HOST)
  end

  def hosts
    request? ? [host] : ENV.fetch("HOSTS", DEFAULT_HOSTS).split(",")
  end

  def base_url
    request? ? request.base_url : ENV.fetch("BASE_URL", DEFAULT_BASE_URL)
  end

  def public_suffix
    PublicSuffix.parse(host)
  rescue PublicSuffix::DomainNotAllowed
    LOCALHOST_PUBLIC_SUFFIX
  end

  def sld
    public_suffix.sld.to_s
  end

  def tld
    public_suffix.tld.to_s
  end

  def trd
    public_suffix.trd.to_s
  end

  def domain
    sld.present? ? "#{sld}.#{tld}" : tld
  end

  def subdomain
    trd
  end

  def subdomains
    subdomain.split(".")
  end

  def first_subdomain
    subdomains.first.to_s.to_sym
  end

  def test?
    env.test?
  end

  def development?
    env.development?
  end

  def localhost?
    env.localhost?
  end

  def staging?
    env.staging?
  end

  def production?
    env.production?
  end

  def bg_env
    BG_ENVS.fetch(env.to_sym, DEFAULT_BG_ENV)
  end

  def text_env
    TEXT_ENVS.fetch(env.to_sym, DEFAULT_TEXT_ENV)
  end

  def border_env
    BORDER_ENVS.fetch(env.to_sym, DEFAULT_BORDER_ENV)
  end

  def translated_env
    I18n.t("current.model.envs.#{env}")
  end

  def env
    ENV
      .fetch("CODE_ENV") do
        case Rails.env.to_sym
        when :test
          :test
        when :development
          first_subdomain == :dev ? :development : :localhost
        when :production
          first_subdomain == :staging ? :staging : :production
        else
          :production
        end
      end
      .to_s
      .inquiry
  end

  def user_or_guest
    user || guest
  end

  def admin?
    (user || guest).admin?
  end

  def user=(user)
    self.time_zone = user&.time_zone
    super
  end

  def time_zone=(time_zone)
    Time.zone = user&.time_zone || time_zone
    super(user&.time_zone || time_zone)
  end

  def user!
    user || (self.user = User.create!)
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

  def names
    (user || guest).names.verified
  end

  def names?
    names.any?
  end

  def names!
    raise(Code::Error, "no verified names found") unless names?

    names
  end

  def name
    names.primary.first || names.first
  end

  def name?
    name.present?
  end

  def name!
    raise(Code::Error, "no verified name found") unless name?

    name
  end

  def unverified_names
    (user || guest).names
  end

  def unverified_names?
    unverified_names.any?
  end

  def unverified_names!
    raise(Code::Error, "no names found") unless unverified_names?

    unverified_names
  end

  def unverified_name
    unverified_names.primary.first || unverified_names.first
  end

  def unverified_name?
    unverified_name.present?
  end

  def unverified_name!
    raise(Code::Error, "name not found") unless unverified_name?

    unverified_name
  end

  def handles
    (user || guest).handles.verified
  end

  def handles?
    handles.any?
  end

  def handles!
    raise(Code::Error, "no verified handles found") unless handles?

    handles
  end

  def handle
    handles.primary.first || handles.first
  end

  def handle?
    handle.present?
  end

  def handle!
    raise(Code::Error, "no verified handle found") unless handle?

    handle
  end

  def unverified_handles
    (user || guest).handles
  end

  def unverified_handles?
    unverified_handles.any?
  end

  def unverified_handles!
    raise(Code::Error, "no handles found") unless unverified_handles?

    unverified_handles
  end

  def unverified_handle
    unverified_handles.primary.first || unverified_handles.first
  end

  def unverified_handle?
    unverified_handle.present?
  end

  def unverified_handle!
    raise(Code::Error, "handle not found") unless unverified_handle?

    unverified_handle
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
    email_addresses.primary.first || email_addresses.first
  end

  def email_address?
    email_address.present?
  end

  def email_address!
    raise(Code::Error, "no verified email address found") unless email_address?

    email_address
  end

  def unverified_email_addresses
    (user || guest).email_addresses
  end

  def unverified_email_addresses?
    unverified_email_addresses.any?
  end

  def unverified_email_addresses!
    unless unverified_email_addresses?
      raise(Code::Error, "no email addresses found")
    end

    unverified_email_addresses
  end

  def unverified_email_address
    unverified_email_addresses.primary.first || unverified_email_addresses.first
  end

  def unverified_email_address?
    unverified_email_address.present?
  end

  def unverified_email_address!
    unless unverified_email_address?
      raise(Code::Error, "email address not found")
    end

    unverified_email_address
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
    phone_numbers.primary.first || phone_numbers.first
  end

  def phone_number?
    phone_number.present?
  end

  def phone_number!
    raise(Code::Error, "no verified phone number found") unless phone_number?

    phone_number
  end

  def unverified_phone_numbers
    (user || guest).phone_numbers
  end

  def unverified_phone_numbers?
    unverified_phone_numbers.any?
  end

  def unverified_phone_numbers!
    unless unverified_phone_numbers?
      raise(Code::Error, "no phone numbers found")
    end

    unverified_phone_numbers
  end

  def unverified_phone_number
    unverified_phone_numbers.primary.first || unverified_phone_numbers.first
  end

  def unverified_phone_number?
    unverified_phone_number.present?
  end

  def unverified_phone_number!
    raise(Code::Error, "phone number not found") unless unverified_phone_number?

    unverified_phone_number
  end

  def addresses
    (user || guest).addresses.verified
  end

  def addresses?
    addresses.any?
  end

  def addresses!
    raise(Code::Error, "no verified addresses found") unless addresses?

    addresses
  end

  def address
    addresses.primary.first || addresses.first
  end

  def address?
    address.present?
  end

  def address!
    raise(Code::Error, "no verified address found") unless address?

    address
  end

  def unverified_addresses
    (user || guest).addresses
  end

  def unverified_addresses?
    unverified_addresses.any?
  end

  def unverified_addresses!
    raise(Code::Error, "no addresses found") unless unverified_addresses?

    unverified_addresses
  end

  def unverified_address
    unverified_addresses.primary.first || unverified_addresses.first
  end

  def unverified_address?
    unverified_address.present?
  end

  def unverified_address!
    raise(Code::Error, "address not found") unless unverified_address?

    unverified_address
  end

  def passwords
    (user || guest).passwords.verified
  end

  def passwords?
    passwords.any?
  end

  def passwords!
    raise(Code::Error, "no verified passwords found") unless passwords?

    passwords
  end

  def password
    passwords.primary.first || passwords.first
  end

  def password?
    password.present?
  end

  def password!
    raise(Code::Error, "no verified password found") unless password?

    password
  end

  def unverified_passwords
    (user || guest).passwords
  end

  def unverified_passwords?
    unverified_passwords.any?
  end

  def unverified_passwords!
    raise(Code::Error, "no passwords found") unless unverified_passwords?

    unverified_passwords
  end

  def unverified_password
    unverified_passwords.primary.first || unverified_passwords.first
  end

  def unverified_password?
    unverified_password.present?
  end

  def unverified_password!
    raise(Code::Error, "password not found") unless unverified_password?

    unverified_password
  end

  def time_zones
    (user || guest).time_zones.verified
  end

  def time_zones?
    time_zones.any?
  end

  def time_zones!
    raise(Code::Error, "no verified time zones found") unless time_zones?

    time_zones
  end

  def time_zone
    time_zones.primary.first || time_zones.first
  end

  def time_zone?
    time_zone.present?
  end

  def time_zone!
    raise(Code::Error, "no verified time zone found") unless time_zone?

    time_zone
  end

  def unverified_time_zones
    (user || guest).time_zones
  end

  def unverified_time_zones?
    unverified_time_zones.any?
  end

  def unverified_time_zones!
    raise(Code::Error, "no time zones found") unless unverified_time_zones?

    unverified_time_zones
  end

  def unverified_time_zone
    unverified_time_zones.primary.first || unverified_time_zones.first
  end

  def unverified_time_zone?
    unverified_time_zone.present?
  end

  def unverified_time_zone!
    raise(Code::Error, "time zone not found") unless unverified_time_zone?

    unverified_time_zone
  end

  def programs
    (user || guest).programs.verified
  end

  def programs?
    programs.any?
  end

  def programs!
    raise(Code::Error, "no verified programs found") unless programs?

    programs
  end

  def program
    programs.primary.first || programs.first
  end

  def program?
    program.present?
  end

  def program!
    raise(Code::Error, "no verified program found") unless program?

    program
  end

  def unverified_programs
    (user || guest).programs
  end

  def unverified_programs?
    unverified_programs.any?
  end

  def unverified_programs!
    raise(Code::Error, "no programs found") unless unverified_programs?

    unverified_programs
  end

  def unverified_program
    unverified_programs.primary.first || unverified_programs.first
  end

  def unverified_program?
    unverified_program.present?
  end

  def unverified_program!
    raise(Code::Error, "program not found") unless unverified_program?

    unverified_program
  end

  def schedules
    (user || guest).schedules.verified
  end

  def schedules?
    schedules.any?
  end

  def schedules!
    raise(Code::Error, "no verified schedules found") unless schedules?

    schedules
  end

  def schedule
    schedules.primary.first || schedules.first
  end

  def schedule?
    schedule.present?
  end

  def schedule!
    raise(Code::Error, "no verified schedule found") unless schedule?

    schedule
  end

  def unverified_schedules
    (user || guest).schedules
  end

  def unverified_schedules?
    unverified_schedules.any?
  end

  def unverified_schedules!
    raise(Code::Error, "no schedules found") unless unverified_schedules?

    unverified_schedules
  end

  def unverified_schedule
    unverified_schedules.primary.first || unverified_schedules.first
  end

  def unverified_schedule?
    unverified_schedule.present?
  end

  def unverified_schedule!
    raise(Code::Error, "schedule not found") unless unverified_schedule?

    unverified_schedule
  end

  def executions
    (user || guest).executions.verified
  end

  def executions?
    executions.any?
  end

  def executions!
    raise(Code::Error, "no verified executions found") unless executions?

    executions
  end

  def execution
    executions.primary.first || executions.first
  end

  def execution?
    execution.present?
  end

  def execution!
    raise(Code::Error, "no verified execution found") unless execution?

    execution
  end

  def unverified_executions
    (user || guest).executions
  end

  def unverified_executions?
    unverified_executions.any?
  end

  def unverified_executions!
    raise(Code::Error, "no executions found") unless unverified_executions?

    unverified_executions
  end

  def unverified_execution
    unverified_executions.primary.first || unverified_executions.first
  end

  def unverified_execution?
    unverified_execution.present?
  end

  def unverified_execution!
    raise(Code::Error, "execution not found") unless unverified_execution?

    unverified_execution
  end
end
