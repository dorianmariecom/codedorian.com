# frozen_string_literal: true

class RedditConnectionsController < ApplicationController
  def index
    authorize(DeliveryConnection, policy_class: RedditConnectionPolicy)
    @connections = scope.order(:id).page(params[:page])
    add_breadcrumb(text: t(".title"), path: reddit_connections_path)
    respond_to do |format|
      format.html
      format.json { render json: { data: @connections.as_json(only: %i[id name enabled]) } }
    end
  end

  def create
    authorize(DeliveryConnection, policy_class: RedditConnectionPolicy)
    scope
    unless RedditOauth.configured?
      redirect_to reddit_connections_path, alert: t("reddit_connections.index.unavailable")
      return
    end

    state = SecureRandom.hex(32)
    session[:reddit_oauth] = { state: state, user_id: current_user.id, expires_at: 10.minutes.from_now.to_i }
    redirect_to RedditOauth.authorization_url(state: state, redirect_uri: callback_url), allow_other_host: true
  end

  def callback
    authorize(DeliveryConnection, policy_class: RedditConnectionPolicy)
    connections = scope
    pending = session.delete(:reddit_oauth)
    unless pending && pending["user_id"] == current_user.id &&
             pending["expires_at"].to_i > Time.current.to_i &&
             params[:state].is_a?(String) &&
             ActiveSupport::SecurityUtils.secure_compare(pending["state"], params[:state])
      redirect_to reddit_connections_path, alert: t(".invalid_state")
      return
    end
    if params[:error].present? || !params[:code].is_a?(String) || params[:code].blank?
      redirect_to reddit_connections_path, alert: t(".failed")
      return
    end

    attributes = RedditOauth.exchange(code: params[:code], redirect_uri: callback_url)
    current_user.with_lock do
      connection = connections.find_or_initialize_by(sender: attributes[:sender])
      connection.assign_attributes(attributes)
      connection.save!
    end
    redirect_to reddit_connections_path, notice: t(".connected")
  rescue RedditOauth::Error
    redirect_to reddit_connections_path, alert: t(".failed")
  end

  def destroy
    connection = authorize(scope.find(params.expect(:id)), policy_class: RedditConnectionPolicy)
    connection.update!(enabled: false, access_token: nil, refresh_token: nil, token_expires_at: nil)
    respond_to do |format|
      format.html { redirect_to reddit_connections_path, notice: t(".notice") }
      format.json { render json: { status: :ok, data: nil } }
    end
  end

  private

  def scope
    policy_scope(DeliveryConnection, policy_scope_class: RedditConnectionPolicy::Scope)
  end

  def callback_url
    "#{Current.base_url.to_s.delete_suffix('/')}#{callback_reddit_connections_path(locale: nil)}"
  end
end
