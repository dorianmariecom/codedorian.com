# frozen_string_literal: true

class DeliveryDestinationsController < ApplicationController
  before_action do
    add_breadcrumb(key: "delivery_destinations.index", path: index_url)
  end
  before_action :load_delivery_destination,
                only: %i[show edit update destroy delete]

  def index
    authorize(DeliveryDestination)
    @delivery_destinations = scope.order(:id).page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_destinations }
      end
    end
  end

  def show
    @logs =
      policy_scope(Log)
        .where_delivery_destination(@delivery_destination)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where_delivery_destination(@delivery_destination)
        .order(created_at: :desc)
        .page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_destination }
      end
    end
  end

  def new
    @delivery_destination = authorize(scope.new(user: current_user))
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_destination }
      end
    end
  end

  def edit
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_destination }
      end
    end
  end

  def create
    @delivery_destination = authorize(scope.new(delivery_destination_params))
    persist(:new, t(".notice"))
  end

  def update
    @delivery_destination.assign_attributes(delivery_destination_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    if @delivery_destination.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def delete
    if @delivery_destination.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def destroy_all
    authorize(DeliveryDestination)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(DeliveryDestination)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def scope = searched_policy_scope(DeliveryDestination)
  def model_class = DeliveryDestination
  def model_instance = @delivery_destination
  def nested = []
  def filters = []

  def load_delivery_destination
    @delivery_destination = authorize(scope.find(params.expect(:id)))
    set_context(delivery_destination: @delivery_destination)
    add_breadcrumb(text: @delivery_destination, path: show_url)
  end

  def delivery_destination_params
    attributes =
      params.expect(
        delivery_destination: %i[
          user_id
          delivery_channel_id
          delivery_connection_id
          recipient
          visibility
          enabled
        ]
      )
    attributes.delete(:user_id) unless admin?
    attributes
  end
end
