# frozen_string_literal: true

class ApplicationController < ActionController::Base
  ERROR_MESSAGE_LIMIT = 140
  OMISSION = "…"

  include Pundit::Authorization
  include CanConcern

  protect_from_forgery with: :exception
  skip_forgery_protection if: :current_token?

  before_action :set_current_user
  before_action :set_current_request
  before_action :set_time_zone
  before_action :set_locale
  before_action :set_paper_trail_whodunnit
  before_action :verify_captcha
  after_action :verify_authorized
  after_action :verify_policy_scoped
  after_action :delete_link_header
  skip_before_action :verify_captcha, if: :mission_control_controller?
  skip_after_action :verify_authorized, if: :mission_control_controller?
  skip_after_action :verify_policy_scoped, if: :mission_control_controller?
  around_action :set_error_context

  helper_method :current_user
  helper_method :current_guest
  helper_method :current_user_or_guest
  helper_method :current_user?
  helper_method :registered?
  helper_method :guest?
  helper_method :current_time_zone
  helper_method :admin?
  helper_method :can?

  REDIRECT_ERROR =
    lambda do |error|
      message = error&.message.presence.to_s
      message_truncated =
        message.truncate(ERROR_MESSAGE_LIMIT, omission: OMISSION)
      redirect_to(root_path, alert: message_truncated.presence)
    end

  rescue_from Pundit::NotAuthorizedError, &REDIRECT_ERROR
  rescue_from ActiveRecord::RecordNotFound, &REDIRECT_ERROR
  rescue_from ActionController::MissingExactTemplate, &REDIRECT_ERROR
  rescue_from Recaptcha::VerifyError, &REDIRECT_ERROR

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
    return if current_user?

    message = alert = t("application.current_user_required")

    respond_to do |format|
      format.json { render(json: { message: message }, status: :unauthorized) }
      format.all { redirect_to(root_path, alert: alert) }
    end
  end

  def current_guest
    Current.guest
  end

  def current_user?
    !!current_user
  end

  def admin?
    current_user? && current_user.admin?
  end

  private

  def set_current_user
    log_in(current_user_from_session || current_token&.user)
  end

  def set_current_request
    Current.request = request
  end

  def set_time_zone
    Current.time_zone = current_time_zone
  end

  def log_in(user)
    if Current.user && session[:user_id].present? && user != Current.user
      # leave it as is
    elsif user&.id
      Current.user = user
      session[:user_id] = user.id
    else
      Current.user = nil
      session[:user_id] = nil
    end
  end

  def log_out(user)
    return unless user == Current.user

    Current.user = nil
    reset_session
  end

  def delete_link_header
    response.headers.delete("Link")
  end

  def mission_control_controller?
    is_a?(::MissionControl::Jobs::ApplicationController)
  end

  def current_user_from_session
    session[:user_id].present? ? User.find_by(id: session[:user_id]) : nil
  end

  def current_token
    return if request.headers[:Token].blank?

    @current_token ||= Token.find_by(token: request.headers[:Token])
  end

  def current_time_zone
    current_user&.time_zone.presence || session[:time_zone].presence
  end

  def current_token?
    !!current_token
  end

  def set_locale
    I18n.locale =
      locale_param.presence || current_user&.locale.presence ||
        browser_locale.presence || I18n.default_locale
  end

  def browser_locale
    http_accept_language.compatible_language_from(I18n.available_locales)
  end

  def locale_param
    params[:locale].presence_in(I18n.available_locales.map(&:to_s))
  end

  def default_url_options
    { locale: locale_param }
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

  def set_error_context(&block)
    Rails.error.handle(
      context: {
        registered?: registered?,
        user_id: Current.user&.id,
        user_to_s: Current.user&.to_s,
        user_to_unverified_s: Current.user&.to_unverified_s,
        user_admin?: Current.admin?
      },
      &block
    )
  end
end
