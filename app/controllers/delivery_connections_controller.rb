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

    attributes =
      params.expect(
        delivery_connection: [
          :user_id,
          :name,
          :provider,
          :enabled,
          { credentials: {} }
        ]
      )
    credentials =
      attributes
        .delete(:credentials)
        &.to_h
        &.reject { |_key, value| value.blank? }
    if credentials&.key?("smtp_settings")
      credentials["smtp_settings"].reject! { |_key, value| value.blank? }
      credentials.delete("smtp_settings") if credentials["smtp_settings"].empty?
    end
    if credentials.present?
      attributes[:credentials] = (
        @delivery_connection&.credentials || {}
      ).deep_merge(credentials)
    end
    attributes
  end
end
