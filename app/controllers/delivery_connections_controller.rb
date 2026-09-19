# frozen_string_literal: true

class DeliveryConnectionsController < ApplicationController
  before_action do
    add_breadcrumb(key: "delivery_connections.index", path: index_url)
  end
  before_action :load_delivery_connection,
                only: %i[show edit update destroy delete]

  def index
    authorize(DeliveryConnection)
    @delivery_connections = scope.order(:id).page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_connections }
      end
    end
  end

  def show
    @logs =
      policy_scope(Log)
        .where_delivery_connection(@delivery_connection)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where_delivery_connection(@delivery_connection)
        .order(created_at: :desc)
        .page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_connection }
      end
    end
  end

  def new
    @delivery_connection = authorize(scope.new(user: current_user))
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_connection }
      end
    end
  end

  def edit
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_connection }
      end
    end
  end

  def create
    @delivery_connection = authorize(scope.new(delivery_connection_params))
    persist(:new, t(".notice"))
  end

  def connect
    authorize(DeliveryConnection.new(user: current_user, provider: params[:provider]))
    scope
    pending = DeliveryConnectionOauth.pending(user: current_user, provider: params[:provider], redirect_uri: callback_url, server: params[:server], scope: params[:scope])
    session[:delivery_connection_oauth] = pending
    redirect_to DeliveryConnectionOauth.authorization_url(pending: pending, redirect_uri: callback_url), allow_other_host: true
  rescue *DeliveryConnectionOauth::ERRORS
    redirect_to delivery_connections_path, alert: t(".failed")
  end

  def callback
    authorize(DeliveryConnection.new(user: current_user, provider: params[:provider]))
    connections = scope.where_user(current_user).where_provider(params[:provider])
    pending = session.delete(:delivery_connection_oauth)
    unless DeliveryConnectionOauth.valid_state?(pending: pending, user: current_user, provider: params[:provider], state: params[:state])
      redirect_to delivery_connections_path, alert: t(".invalid_state")
      return
    end
    if params[:error].present? || !params[:code].is_a?(String) || params[:code].blank?
      redirect_to delivery_connections_path, alert: t(".failed")
      return
    end

    attributes = DeliveryConnectionOauth.exchange(pending: pending, code: params[:code], redirect_uri: callback_url)
    current_user.with_lock do
      attributes.each do |account|
        connection = connections.find_or_initialize_by(sender: account[:sender], account_sid: account[:account_sid], base_url: account[:base_url])
        connection.assign_attributes(account)
        connection.save!
      end
    end
    redirect_to delivery_connections_path, notice: t(".connected")
  rescue *DeliveryConnectionOauth::ERRORS
    redirect_to delivery_connections_path, alert: t(".failed")
  end

  def update
    @delivery_connection.assign_attributes(delivery_connection_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    if @delivery_connection.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def delete
    if @delivery_connection.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def destroy_all
    authorize(DeliveryConnection)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(DeliveryConnection)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def callback_url
    "#{Current.base_url}#{callback_delivery_connections_path(provider: params[:provider], locale: nil)}"
  end

  def scope = searched_policy_scope(DeliveryConnection)
  def model_class = DeliveryConnection
  def model_instance = @delivery_connection
  def nested = []
  def filters = []

  def load_delivery_connection
    @delivery_connection = authorize(scope.find(params.expect(:id)))
    set_context(delivery_connection: @delivery_connection)
    add_breadcrumb(text: @delivery_connection, path: show_url)
  end

  def delivery_connection_params
    return {} unless admin?

    params.expect(
      delivery_connection: %i[
        user_id
        name
        provider
        enabled
        access_token
        scope
        base_url
        account_sid
        auth_token
        api_key
        sender
        smtp_from
        smtp_address
        smtp_port
        smtp_user_name
        smtp_password
        smtp_authentication
        aws_access_key_id
        aws_secret_access_key
        aws_session_token
        aws_region
        mailgun_domain
        mailgun_region
      ]
    )
  end
end
