# frozen_string_literal: true

class ConnectionsController < ApplicationController
  before_action { add_breadcrumb(key: "connections.index", path: index_url) }
  before_action :load_connection, only: %i[show edit update destroy delete]

  def index
    authorize(Connection)
    @connections = scope.order(:id).page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @connections }
      end
    end
  end

  def show
    @logs =
      policy_scope(Log)
        .where_connection(@connection)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where_connection(@connection)
        .order(created_at: :desc)
        .page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @connection }
      end
    end
  end

  def new
    @connection = authorize(scope.new(user: current_user))
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @connection }
      end
    end
  end

  def edit
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @connection }
      end
    end
  end

  def create
    @connection = authorize(scope.new(connection_params))
    persist(:new, t(".notice"))
  end

  def connect
    authorize(Connection.new(user: current_user, provider: params[:provider]))
    scope
    pending =
      ConnectionOauth.pending(
        user: current_user,
        provider: params[:provider],
        redirect_uri: callback_url,
        server: params[:server],
        scope: params[:scope]
      )
    session[:connection_oauth] = pending
    redirect_to ConnectionOauth.authorization_url(
                  pending: pending,
                  redirect_uri: callback_url
                ),
                allow_other_host: true
  rescue *ConnectionOauth::ERRORS
    redirect_to connections_path, alert: t(".failed")
  end

  def callback
    authorize(Connection.new(user: current_user, provider: params[:provider]))
    connections =
      scope.where_user(current_user).where_provider(params[:provider])
    pending = session.delete(:connection_oauth)
    unless ConnectionOauth.valid_state?(
             pending: pending,
             user: current_user,
             provider: params[:provider],
             state: params[:state]
           )
      redirect_to connections_path, alert: t(".invalid_state")
      return
    end
    if params[:error].present? || !params[:code].is_a?(String) ||
         params[:code].blank?
      redirect_to connections_path, alert: t(".failed")
      return
    end

    attributes =
      ConnectionOauth.exchange(
        pending: pending,
        code: params[:code],
        redirect_uri: callback_url
      )
    current_user.with_lock do
      attributes.each do |account|
        connection =
          connections.find_or_initialize_by(
            sender: account[:sender],
            account_sid: account[:account_sid],
            base_url: account[:base_url]
          )
        connection.assign_attributes(account)
        connection.save!
      end
    end
    redirect_to connections_path, notice: t(".connected")
  rescue *ConnectionOauth::ERRORS
    redirect_to connections_path, alert: t(".failed")
  end

  def update
    @connection.assign_attributes(connection_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    if @connection.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def delete
    if @connection.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def destroy_all
    authorize(Connection)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(Connection)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def callback_url
    "#{Current.base_url}#{callback_connections_path(provider: params[:provider], locale: nil)}"
  end

  def scope = searched_policy_scope(Connection)
  def model_class = Connection
  def model_instance = @connection
  def nested = []
  def filters = []

  def load_connection
    @connection = authorize(scope.find(params.expect(:id)))
    set_context(connection: @connection)
    add_breadcrumb(text: @connection, path: show_url)
  end

  def connection_params
    return {} unless admin?

    params.expect(
      connection: %i[
        user_id
        email
        username
        external_id
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
