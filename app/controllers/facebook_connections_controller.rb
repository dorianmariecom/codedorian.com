# frozen_string_literal: true

class FacebookConnectionsController < ApplicationController
  before_action :require_admin

  def index
    authorize(DeliveryConnection, policy_class: FacebookConnectionPolicy)
    @connections = scope.order(:id).page(params[:page])
    add_breadcrumb(text: t(".title"), path: facebook_connections_path)
    respond_to do |format|
      format.html
      format.json { render json: { data: @connections.as_json(only: %i[id name enabled]) } }
    end
  end

  def create
    authorize(DeliveryConnection, policy_class: FacebookConnectionPolicy)
    scope
    unless FacebookOauth.configured?
      redirect_to facebook_connections_path, alert: t("facebook_connections.index.unavailable")
      return
    end

    state = SecureRandom.hex(32)
    session[:facebook_oauth] = { state: state, user_id: current_user.id, expires_at: 10.minutes.from_now.to_i }
    redirect_to FacebookOauth.authorization_url(state: state, redirect_uri: callback_url), allow_other_host: true
  end

  def callback
    authorize(DeliveryConnection, policy_class: FacebookConnectionPolicy)
    connections = scope
    pending = session.delete(:facebook_oauth)
    unless pending && pending["user_id"] == current_user.id &&
             pending["expires_at"].to_i > Time.current.to_i &&
             params[:state].is_a?(String) &&
             ActiveSupport::SecurityUtils.secure_compare(pending["state"], params[:state])
      redirect_to facebook_connections_path, alert: t(".invalid_state")
      return
    end
    if params[:error].present? || !params[:code].is_a?(String) || params[:code].blank?
      redirect_to facebook_connections_path, alert: t(".failed")
      return
    end

    accounts = FacebookOauth.exchange(code: params[:code], redirect_uri: callback_url)
    current_user.with_lock do
      accounts.each do |attributes|
        connection = connections.find_or_initialize_by(sender: attributes[:sender])
        connection.assign_attributes(attributes)
        connection.save!
      end
    end
    redirect_to facebook_connections_path, notice: t(".connected")
  rescue FacebookOauth::Error => e
    Rails.logger.warn("Facebook OAuth failed: reason=#{e.reason} stage=#{e.stage} code=#{e.provider_code} subcode=#{e.provider_subcode}")
    message = e.reason.in?(%w[missing_permissions no_pages]) ? e.reason : "failed"
    redirect_to facebook_connections_path, alert: t(".#{message}")
  end

  def destroy
    connection = authorize(scope.find(params.expect(:id)), policy_class: FacebookConnectionPolicy)
    connection.update!(enabled: false, access_token: nil)
    respond_to do |format|
      format.html { redirect_to facebook_connections_path, notice: t(".notice") }
      format.json { render json: { status: :ok, data: nil } }
    end
  end

  private

  def require_admin
    raise Pundit::NotAuthorizedError unless admin?
  end

  def scope
    policy_scope(DeliveryConnection, policy_scope_class: FacebookConnectionPolicy::Scope)
  end

  def callback_url
    "#{Current.base_url.to_s.delete_suffix('/')}#{callback_facebook_connections_path(locale: nil)}"
  end
end
