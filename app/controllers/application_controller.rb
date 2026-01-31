# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include(CanConcern)
  include(LogConcern)
  include(PerformLaterConcern)
  include(Pundit::Authorization)

  protect_from_forgery(with: :exception)

  skip_forgery_protection(if: :current_token?)

  before_action(:set_current_user)
  before_action(:set_current_guest)
  before_action(:set_current_request)
  before_action(:set_current_version)
  before_action(:set_current_commit)
  before_action(:set_current_time_zone)
  before_action(:set_current_locale)
  before_action(:set_paper_trail_whodunnit)
  before_action(:set_breadcrumbs)
  before_action(:verify_captcha)
  before_action(:authorize_profiler)

  after_action(:verify_authorized)
  after_action(:verify_policy_scoped)
  after_action(:delete_link_header)

  helper_method(:current_user)
  helper_method(:current_guest)
  helper_method(:current_user_or_guest)
  helper_method(:current_user?)
  helper_method(:current_guest?)
  helper_method(:registered?)
  helper_method(:guest?)
  helper_method(:current_time_zone)
  helper_method(:current_persisted_time_zone)
  helper_method(:admin?)
  helper_method(:can?)
  helper_method(:error_message_for)
  helper_method(:current_version)
  helper_method(:current_commit)
  helper_method(:hotwire_native_modal?)
  helper_method(:filters)
  helper_method(:index_url)
  helper_method(:show_url)
  helper_method(:new_url)
  helper_method(:edit_url)
  helper_method(:form_url)
  helper_method(:destroy_all_url)
  helper_method(:delete_all_url)
  helper_method(:delete_url)
  helper_method(:destroy_url)
  helper_method(:nested)
  helper_method(:search_params)
  helper_method(:resources_name)
  helper_method(:resource_name)
  helper_method(:model_class)
  helper_method(:model_instance)
  helper_method(:en?)
  helper_method(:fr?)

  RESCUE_FROM =
    lambda do |error|
      set_context(error: error)

      log!(:rescue_from)

      respond_to do |format|
        format.json do
          render(
            json: {
              message: error_message_for(error)
            },
            status: :bad_request
          )
        end
        format.any { redirect_to(main_app.root_path, alert: error_message_for(error)) }
      end
    end

  rescue_from(ActionController::MissingExactTemplate, &RESCUE_FROM)
  rescue_from(ActionController::ParameterMissing, &RESCUE_FROM)
  rescue_from(ActiveRecord::RecordNotFound, &RESCUE_FROM)
  rescue_from(ActiveRecord::RecordNotUnique, &RESCUE_FROM)
  rescue_from(Pundit::NotAuthorizedError, &RESCUE_FROM)
  rescue_from(Recaptcha::VerifyError, &RESCUE_FROM)

  private

  def registered?
    current_user?
  end

  def guest?
    !registered?
  end

  def current_user_or_guest
    Current.user_or_guest
  end

  def current_user
    Current.user
  end

  def current_user!
    set_current_user

    return if current_user?

    message = alert = t("application.current_user_required")

    respond_to do |format|
      format.json { render(json: { message: message }, status: :unauthorized) }
      format.any { redirect_to(main_app.root_path, alert: alert) }
    end
  end

  def current_admin!
    set_current_user

    return if current_user? && admin?

    message = alert = t("application.current_admin_required")

    respond_to do |format|
      format.json { render(json: { message: message }, status: :unauthorized) }
      format.any { redirect_to(main_app.root_path, alert: alert) }
    end
  end

  def current_guest
    Current.guest
  end

  def current_user?
    !!current_user
  end

  def admin?
    current_user_or_guest.admin?
  end

  def set_current_user
    log_in(current_user_from_session || current_token&.user)
    set_context(current_user: current_user) if registered?
  end

  def set_current_guest
    log_in_guest(current_guest_from_session || current_guest!) if guest?
    set_context(current_guest: current_guest) if guest?
  end

  def set_current_request
    Current.request = request
    set_context(current_request: request)
  end

  def set_current_version
    set_context(current_version: current_version)
  end

  def set_current_commit
    set_context(current_commit: current_commit)
  end

  def set_current_time_zone
    Current.time_zone = current_time_zone
    set_context(current_time_zone: current_time_zone)
  end

  def log_in(user)
    if Current.user && session[:user_id].present? && user != Current.user
      # leave it as is
    elsif user&.id
      Current.user = user
      session[:user_id] = user.id
      log_out_guest(current_guest)
    else
      Current.user = nil
      session[:user_id] = nil
    end
  end

  def log_in_guest(guest)
    Current.guest = guest
    session[:guest_id] = guest.id
  end

  def log_out(user)
    return unless user == Current.user

    Current.user = nil
    Current.guest = nil
    session[:user_id] = nil
    session[:time_zone] = nil

    reset_session if session[:previous_user_ids].blank?

    while session[:previous_user_ids].present?
      previous_user_id = session[:previous_user_ids].shift
      previous_user = User.find_by(id: previous_user_id)

      if previous_user
        log_in(previous_user)
        break
      end
    end
  end

  def log_out_guest(_guest)
    Current.guest = nil
    session[:guest_id] = nil
  end

  def delete_link_header
    response.headers.delete("Link")
  end

  def current_user_from_session
    session[:user_id].present? ? User.find_by(id: session[:user_id]) : nil
  end

  def current_guest_from_session
    session[:guest_id].present? ? Guest.find_by(id: session[:guest_id]) : nil
  end

  def current_guest!
    Current.guest!
  end

  def current_token
    return if request.headers[:Token].blank?

    if instance_variable_defined?(:@current_token)
      @current_token
    else
      @current_token = Token.find_by(token: request.headers[:Token])
    end
  end

  def current_time_zone
    current_user&.unverified_time_zone.presence || session[:time_zone].presence
  end

  def current_persisted_time_zone
    if current_user?
      current_user.unverified_time_zone.presence
    else
      session[:time_zone].presence
    end
  end

  def current_token?
    !!current_token
  end

  def set_current_locale
    I18n.locale =
      locale_param.presence || current_user&.locale.presence ||
        browser_locale.presence || I18n.default_locale
  end

  def browser_locale
    http_accept_language.compatible_language_from(LOCALES_SYMBOLS)
  end

  def locale_param
    params[:locale].presence_in(LOCALES_STRINGS)
  end

  def default_url_options
    super.merge(locale: locale_param)
  end

  def recaptcha_site_key
    Config.google.recaptcha.site_key
  end

  def recaptcha_api_key
    Config.google.recaptcha.api_key
  end

  def recaptcha_project_id
    Config.google.recaptcha.project_id
  end

  def verify_captcha
    return if request.get? || request.head?

    verify_recaptcha!(
      action: params["g-recaptcha-action"],
      recaptcha_v3: true,
      site_key: recaptcha_site_key,
      enterprise_api_key: recaptcha_api_key,
      enterprise_project_id: recaptcha_project_id
    )
  end

  def set_context(**args)
    return if args.blank?

    Rails.error.set_context(**Log.convert(args))
    Sentry.set_tags(**sentry_hash(Log.convert(args)))
    Current.context.merge!(**Log.convert(args))
  end

  def sentry_hash(hash, prefix = nil, acc = {})
    hash.each do |k, v|
      key = [prefix, k].compact.join("_")

      v.is_a?(Hash) ? sentry_hash(v, key, acc) : acc[key.to_sym] = v
    end

    acc
  end

  def error_message_for(error)
    class_name = error&.class&.name.to_s
    message = admin? ? error&.message.presence.to_s : nil
    Truncate.strip([class_name, message].compact_blank.join(": "))
  end

  def searched_policy_scope(model)
    policy_scope(model).search(q: q)
  end

  def q
    params.dig(:search, :q).presence
  end

  def search_params
    q.present? ? { search: { q: q } } : nil
  end

  def current_version
    app_version =
      request.headers["user-agent"]
        .to_s
        .scan(%r{com\.codedorian(?:\.[a-z]+)?/([0-9.]+)})
        .first
        &.first
        .to_s
        .presence

    app_version ||= "0.0"

    Gem::Version.new(app_version)
  end

  def current_commit
    ENV.fetch("KAMAL_VERSION", nil)
  end

  def hotwire_native_modal?
    return false if request.path == new_user_path
    return false if request.path == new_login_path
    return true if request.path.ends_with?("/new")
    return true if request.path.ends_with?("/edit")

    false
  end

  def model_class
    raise(NotImplementedError, "#{self.class}#model_class not implemented")
  end

  def model_instance
    raise(NotImplementedError, "#{self.class}#model_instance not implemented")
  end

  def nested(...)
    raise(NotImplementedError, "#{self.class}#nested not implemented")
  end

  def filters
    raise(NotImplementedError, "#{self.class}#filters not implemented")
  end

  def resource_name
    model_class.name.underscore.to_sym
  end

  def resources_name
    model_class.name.underscore.pluralize.to_sym
  end

  def index_url(...)
    [*nested(...), resources_name, **search_params]
  end

  def destroy_all_url(...)
    [:destroy_all, *index_url(...)]
  end

  def delete_all_url(...)
    [:delete_all, *index_url(...)]
  end

  def show_url(...)
    [*nested(...), model_instance]
  end

  def new_url(...)
    [:new, *nested(...), resource_name]
  end

  def edit_url(...)
    [:edit, *show_url(...)]
  end

  def delete_url(...)
    [*show_url(...), :delete]
  end

  def destroy_url(...)
    [*show_url(...), :destroy]
  end

  def set_breadcrumbs
    @breadcrumbs = [{ text: t("breadcrumbs.static.home"), path: main_app.root_path }]
  end

  def add_breadcrumb(
    text: nil,
    key: "#{controller_name}.#{action_name}",
    path: url_for
  )
    @breadcrumbs << { text: text || t("breadcrumbs.#{key}"), path: path }
  end

  def authorize_profiler
    Rack::MiniProfiler.authorize_request if admin?
  end

  def en?
    I18n.locale == :en
  end

  def fr?
    I18n.locale == :fr
  end
end
