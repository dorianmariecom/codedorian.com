# frozen_string_literal: true

module ApplicationHelper
  DEFAULT_ACTION = "unknown-action"
  DEFAULT_METHOD = "unknown-method"

  def title
    controller = controller_name
    action = action_name
    action = "new" if action == "create"
    action = "edit" if action == "update"
    content_for(:title).presence || t("#{controller}.#{action}.title")
  end

  def google_maps_api_key
    Rails.application.credentials.google.maps.api_key
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
      .map do |program|
        [program&.to_s, program&.id, { selected: program_id == program&.id }]
      end
  end

  def repl_session_options(repl_session_id: nil)
    policy_scope(ReplSession)
      .order(:id)
      .map do |repl_session|
        [
          repl_session&.to_s,
          repl_session&.id,
          { selected: repl_session_id == repl_session&.id }
        ]
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

  def tokens
    current_user_or_guest.tokens.map(&:token)
  end

  def device_tokens
    current_user_or_guest.devices.map(&:token)
  end

  def fr?
    I18n.locale == :fr
  end

  def en?
    I18n.locale == :en
  end

  def recaptcha_site_key
    Rails.application.credentials.google.recaptcha.site_key
  end

  def recaptcha_tag(action:)
    content_tag(
      :div,
      data: {
        controller: "recaptcha",
        action: "turbo:load@window->recaptcha#connect"
      }
    ) do
      safe_join(
        [
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
            action,
            id: nil,
            data: {
              recaptcha_target: "action"
            }
          )
        ]
      )
    end
  end

  # rubocop:disable Rails/OutputSafety
  def insert_recaptcha_tag(form_html)
    form = Nokogiri.HTML(form_html)

    method =
      form.at_css(%(input[name="_method"]))&.attr(:value).presence ||
        DEFAULT_METHOD
    action = form.at_css(:form)&.attr(:action).presence || DEFAULT_ACTION
    method = method.parameterize.gsub(%r{[^A-Z a-z/_]+}, "_")
    action = action.parameterize.gsub(%r{[^A-Z a-z/_]+}, "_")

    form_html.sub(
      "</form>",
      safe_join(
        [recaptcha_tag(action: "#{method}/#{action}"), "</form>".html_safe]
      )
    ).html_safe
  end
  # rubocop:enable Rails/OutputSafety

  def form_for(...)
    insert_recaptcha_tag(super)
  end

  def button_to(...)
    insert_recaptcha_tag(super)
  end

  def render_collection(partial:, collection:, as:)
    render("shared/collection", partial:, collection:, as:)
  end
end
