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
    Schedule.interval_options.map do |label, value|
      [label, value, { selected: value == interval }]
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

  def locale_options(locale: nil)
    locale = (locale.presence || I18n.locale).to_s

    I18n
      .available_locales
      .map(&:to_s)
      .map do |available_locale|
        [
          I18n.t("users.model.locales.#{available_locale}"),
          available_locale,
          { selected: available_locale == locale }
        ]
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

  def fr?
    I18n.locale == :fr
  end

  def en?
    I18n.locale == :en
  end

  def recaptcha_site_key
    Rails.application.credentials.google_com_recaptcha.site_key
  end

  def recaptcha_tag
    content_tag(
      :div,
      data: {
        controller: "recaptcha",
        action: "turbo:load@window->recaptcha#connect"
      }
    ) do
      safe_join([
        hidden_field_tag(
          "g-recaptcha-response",
          "",
          id: nil,
          data: {
            recaptcha_target: "response"
          }
        ),
        hidden_field_tag(
          "g-recaptcha-action",
          SecureRandom.hex,
          id: nil,
          data: {
            recaptcha_target: "action"
          }
        )
      ])
    end
  end

  def form_for(record, options = {}, &block)
    super { |f| safe_join([capture(f, &block), recaptcha_tag]) }
  end

  # rubocop:disable Rails/OutputSafety
  def button_to(...)
    super.sub(
      "</form>",
      safe_join([recaptcha_tag, "</form>".html_safe])
    ).html_safe
  end
  # rubocop:enable Rails/OutputSafety

  def localhost?
    request.host == "localhost"
  end

  def dev?
    request.subdomains.first == "dev"
  end

  def staging?
    request.subdomains.first == "staging"
  end

  def body_classes
    if localhost?
      "border-green-600"
    elsif dev?
      "border-orange-600"
    elsif staging?
      "border-blue-600"
    else
      "border-black"
    end
  end
end
