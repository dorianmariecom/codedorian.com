# frozen_string_literal: true

class XConnectionsController < ApplicationController
  def index
    authorize(DeliveryConnection, policy_class: XConnectionPolicy)
    @connections = scope.order(:id).page(params[:page])
    add_breadcrumb(text: t(".title"), path: x_connections_path)
    respond_to do |format|
      format.html
      format.json { render json: { data: @connections.as_json(only: %i[id name enabled]) } }
    end
  end

  def create
    authorize(DeliveryConnection, policy_class: XConnectionPolicy)
    scope
    unless XOauth.configured?
      redirect_to x_connections_path, alert: t("x_connections.index.unavailable")
      return
    end

    state = SecureRandom.hex(32)
    verifier = SecureRandom.urlsafe_base64(64)
    session[:x_oauth] = { state: state, verifier: verifier, user_id: current_user.id, expires_at: 10.minutes.from_now.to_i }
    redirect_to XOauth.authorization_url(state: state, verifier: verifier, redirect_uri: callback_url), allow_other_host: true
  end

  def callback
    authorize(DeliveryConnection, policy_class: XConnectionPolicy)
    connections = scope
    pending = session.delete(:x_oauth)
    unless pending && pending["user_id"] == current_user.id &&
             pending["expires_at"].to_i > Time.current.to_i &&
             params[:state].is_a?(String) &&
             ActiveSupport::SecurityUtils.secure_compare(pending["state"], params[:state])
      redirect_to x_connections_path, alert: t(".invalid_state")
      return
    end
    if params[:error].present? || !params[:code].is_a?(String) || params[:code].blank?
      redirect_to x_connections_path, alert: t(".failed")
      return
    end

    attributes = XOauth.exchange(code: params[:code], verifier: pending["verifier"], redirect_uri: callback_url)
    current_user.with_lock do
      connection = connections.find_or_initialize_by(sender: attributes[:sender])
      connection.assign_attributes(attributes)
      connection.save!
    end
    redirect_to x_connections_path, notice: t(".connected")
  rescue XOauth::Error
    redirect_to x_connections_path, alert: t(".failed")
  end

  def destroy
    connection = authorize(scope.find(params.expect(:id)), policy_class: XConnectionPolicy)
    connection.update!(enabled: false, access_token: nil, refresh_token: nil, token_expires_at: nil)
    respond_to do |format|
      format.html { redirect_to x_connections_path, notice: t(".notice") }
      format.json { render json: { status: :ok, data: nil } }
    end
  end

  private

  def scope
    policy_scope(DeliveryConnection, policy_scope_class: XConnectionPolicy::Scope)
  end

  def callback_url
    "#{Current.base_url.to_s.delete_suffix('/')}#{callback_x_connections_path(locale: nil)}"
  end
end
