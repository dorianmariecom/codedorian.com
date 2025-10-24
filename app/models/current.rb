# frozen_string_literal: true

class Current < ActiveSupport::CurrentAttributes
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
  IOS_APP_NAMES = {
    test: "codedorian - test",
    localhost: "codedorian - local",
    development: "codedorian - dev",
    staging: "codedorian - staging",
    production: "codedorian"
  }.freeze
  DEFAULT_ANDROID_APP_NAME = "codedorian"
  ANDROID_APP_NAMES = {
    test: "codedorian - test",
    localhost: "codedorian - local",
    development: "codedorian - dev",
    staging: "codedorian - staging",
    production: "codedorian"
  }.freeze

  LOCALHOST_PUBLIC_SUFFIX = { sld: nil, tld: :localhost, trd: nil }.to_struct

  resets { Time.zone = nil }

  attribute(:user, :time_zone, :request, :program, :repl_program)

  def ios_environments
    Config.rpush.ios.environments
  end

  def android_environments
    Config.rpush.android.environments
  end

  def ios_app_name
    IOS_APP_NAMES.fetch(env.to_sym, DEFAULT_IOS_APP_NAME)
  end

  def android_app_name
    ANDROID_APP_NAMES.fetch(env.to_sym, DEFAULT_ANDROID_APP_NAME)
  end

  def request?
    !!request
  end

  def host
    request? ? request.host : ENV.fetch("HOST", DEFAULT_HOST)
  end

  def hosts
    request? ? [host] : default_hosts
  end

  def default_hosts
    ENV.fetch("HOSTS", DEFAULT_HOSTS).split(",").map(&:strip).compact_blank
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
end
