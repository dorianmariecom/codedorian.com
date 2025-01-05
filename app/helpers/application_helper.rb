# frozen_string_literal: true

module ApplicationHelper
  def title
    controller = controller_name
    action = action_name
    action = "new" if action == "create"
    action = "edit" if action == "update"
    content_for(:title).presence || t("#{controller}.#{action}.title")
  end

  def google_maps_api_key
    Rails.application.credentials.console_cloud_google_com.api_key
  end

  def fake_locations
    Array.new(3) { Faker::Address.full_address }
  end

  def fake_verification_codes(length: 4)
    Array.new(3) { rand(10**length).to_s.rjust(length, "0") }
  end

  def fake_email_addresses
    Array.new(3) { Faker::Internet.email }
  end

  def fake_phone_numbers
    Array.new(3) { Faker::PhoneNumber.phone_number_with_country_code }
  end

  def fake_passwords
    Array.new(3) { Faker::Internet.password }
  end

  def fake_time_zones
    TimeZone::TIME_ZONES.sample(3)
  end

  def fake_names
    Array.new(3) { Faker::Name.name }
  end

  def time_zone_options(time_zone: nil)
    TimeZone::TIME_ZONES.map do |option_time_zone|
      [
        option_time_zone,
        option_time_zone,
        { selected: option_time_zone == time_zone }
      ]
    end
  end

  def schedule_interval_options(interval: nil)
    Schedule::INTERVALS.map do |option_interval|
      [
        option_interval,
        option_interval,
        { selected: option_interval == interval }
      ]
    end
  end

  def device_platform_options(platform: nil)
    Device::PLATFORMS.map do |device_platform|
      [
        device_platform,
        device_platform,
        { selected: device_platform == platform }
      ]
    end
  end

  def user_options(user_id: nil)
    ([nil] + policy_scope(User).order(:id).to_a).map do |user|
      [user&.to_s, user&.id, { selected: user_id == user&.id }]
    end
  end

  def program_options(program_id: nil)
    policy_scope(Program)
      .order(:id)
      .to_a
      .map do |program|
        [program&.to_s, program&.id, { selected: program_id == program&.id }]
      end
  end

  def default_country_code
    PhoneNumber::DEFAULT_COUNTRY_CODE
  end

  def email_address_regexp
    json_regexp(EmailAddress::EMAIL_ADDRESS_REGEXP)
  end

  def verification_code_regexp
    json_regexp(PhoneNumber::VERIFICATION_CODE_REGEXP)
  end

  def whatsapp_to(phone_number, name)
    phone_number = Phonelib.parse(phone_number).e164
    link_to(name, "https://wa.me/#{h(phone_number)}")
  end

  def json_regexp(regexp)
    str =
      regexp
        .inspect
        .sub('\\A', "^")
        .sub('\\Z', "$")
        .sub('\\z', "$")
        .sub(%r{^/}, "")
        .sub(%r{/[a-z]*$}, "")
        .gsub(/\(\?#.+\)/, "")
        .gsub(/\(\?-\w+:/, "(")
        .gsub(/\s/, "")
    Regexp.new(str).source
  end

  def registered?
    current_user.is_an?(User)
  end

  def guest?
    current_user.is_a?(Guest)
  end

  def tokens
    current_user.tokens.map(&:token)
  end

  def device_tokens
    current_user.devices.map(&:token)
  end

  def code_env
    case request.host
    when "localhost"
      "local"
    when "dev.codedorian.com"
      "dev"
    when "staging.codedorian.com"
      "staging"
    else
      "production"
    end
  end

  def breadcrumbs_t(key)
    t("breadcrumbs.#{key}")
  end

  def breadcrumb_to_links(breadcrumb, previous:)
    if breadcrumb.is_an?(ApplicationRecord)
      # @user, :data
      if breadcrumb.persisted?
        [
          [
            breadcrumbs_t(breadcrumb.model_plural),
            previous + [breadcrumb.model_plural]
          ],
          [breadcrumb, breadcrumb]
        ]
      else
        [
          [
            breadcrumbs_t(breadcrumb.model_plural),
            previous + [breadcrumb.model_plural]
          ]
        ]
      end
    elsif %i[new edit].include?(breadcrumb)
      # :new, @user, :datum
      [
        [
          breadcrumbs_t(breadcrumb),
          [breadcrumb, *previous[...-1], previous[-1].model_singular]
        ]
      ]
    else
      # @user, :data
      [[breadcrumbs_t(breadcrumb), previous + [breadcrumb]]]
    end
  end

  def breadcrumbs
    breadcrumbs = Array.wrap(@breadcrumbs).compact.uniq
    return if breadcrumbs.empty?

    links = [[t("breadcrumbs.home"), root_path]]

    links +=
      breadcrumbs
        .map
        .with_index do |breadcrumb, index|
          breadcrumb_to_links(breadcrumb, previous: breadcrumbs[...index])
        end
        .flatten(1)

    tag.p { safe_join(links.map { |text, path| link_to(text, path) }, " > ") }
  end
end
