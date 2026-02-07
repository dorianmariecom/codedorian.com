# frozen_string_literal: true

module ApplicationHelper
  DEFAULT_ACTION = "unknown-action"
  DEFAULT_METHOD = "unknown-method"

  def title
    content_for(:title).presence ||
      t("#{controller_name}.#{meta_action_name}.title")
  end

  def meta_title
    strip_tags(title)
  end

  def description
    content_for(:description).presence ||
      t("#{controller_name}.#{meta_action_name}.description")
  end

  def meta_description
    strip_tags(description)
  end

  def meta_image_url
    content_for(:image).presence || "#{Current.base_url}/img/favicon.png"
  end

  def meta_canonical_url
    return unless request

    host = ENV.fetch("HOST", nil)
    return if host.blank?

    host, port = host.split(":")

    uri = URI.parse(request.original_url)
    uri.scheme = request.scheme
    uri.host = host
    uri.port = port
    uri.query = nil
    uri.fragment = nil
    uri.to_s
  end

  def alternate_locale_urls
    return [] unless request

    I18n.available_locales.map do |locale|
      [
        locale,
        url_for(locale: locale, only_path: false, host: ENV.fetch("HOST", nil))
      ]
    end
  end

  private

  def meta_action_name
    action = action_name
    action = "new" if action == "create"
    action = "edit" if action == "update"
    action
  end

  def sentry_release
    ENV.fetch("KAMAL_VERSION", "unknown")
  end

  def sentry_environment
    Current.env
  end

  def sentry_dsn
    Config.sentry.dsn.js
  end

  def google_maps_api_key
    Config.google.maps.api_key
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

  def example_schedule_interval_options(interval: nil)
    ExampleSchedule.interval_options.map do |label, value|
      [label, value, { selected: value == interval }]
    end
  end

  def program_schedule_interval_options(interval: nil)
    ProgramSchedule.interval_options.map do |label, value|
      [label, value, { selected: value == interval }]
    end
  end

  def program_execution_status_options(status: nil)
    ProgramExecution::STATUSES.map do |option_status|
      [
        t("program_executions.model.statuses.#{option_status}"),
        option_status,
        { selected: option_status == status }
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
      .map do |program|
        [program&.to_s, program&.id, { selected: program_id == program&.id }]
      end
  end

  def locale_options(locale: nil)
    locale = (locale.presence || I18n.locale).to_s

    LOCALES_STRINGS.map do |available_locale|
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

  def recaptcha_site_key
    Config.google.recaptcha.site_key
  end

  def recaptcha_tag(action:)
    content_tag(
      :div,
      data: {
        controller: :recaptcha,
        action: "turbo:load@window->recaptcha#connect"
      }
    ) do
      safe_join(
        [
          hidden_field_tag(
            "g-recaptcha-response",
            "",
            id: nil,
            autocomplete: :off,
            data: {
              recaptcha_target: :response,
              form_type: :other
            }
          ),
          hidden_field_tag(
            "g-recaptcha-action",
            action,
            id: nil,
            autocomplete: :off,
            data: {
              recaptcha_target: :action,
              form_type: :other
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
        form.at_css(:form)&.attr(:method).presence || DEFAULT_METHOD
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

  def render_collection(partial:, collection:, as:, content: true, **extras)
    render(
      "shared/collection",
      partial: partial,
      collection: collection,
      as: as,
      content: content,
      extras: extras
    )
  end

  def turbo_stream_from(first, *streamables, **attributes)
    if first.is_an?(ActiveRecord::Relation)
      safe_join(first.map { |model| turbo_stream_from(model) })
    else
      super
    end
  end
end
