# frozen_string_literal: true

class SubscriptionDestinationsController < ApplicationController
  before_action :load_connection
  before_action :load_delivery_channel
  before_action :load_delivery_destination
  before_action :load_plan
  before_action :load_service
  before_action :load_subscription
  before_action :load_user
  before_action do
    add_breadcrumb(key: "subscription_destinations.index", path: index_url)
  end
  before_action :load_subscription_destination,
                only: %i[show edit update destroy delete]

  def index
    authorize(SubscriptionDestination)
    @subscription_destinations = scope.order(:id).page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: {
          status: :ok,
                 messages: [],
                 data: @subscription_destinations
        }
      end
    end
  end

  def show
    @logs =
      policy_scope(Log)
        .where_subscription_destination(@subscription_destination)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where_subscription_destination(@subscription_destination)
        .order(created_at: :desc)
        .page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: {
          status: :ok,
                 messages: [],
                 data: @subscription_destination
        }
      end
    end
  end

  def new
    @subscription_destination = authorize(scope.new)
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: {
          status: :ok,
                 messages: [],
                 data: @subscription_destination
        }
      end
    end
  end

  def edit
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: {
          status: :ok,
                 messages: [],
                 data: @subscription_destination
        }
      end
    end
  end

  def create
    @subscription_destination =
      authorize(scope.new(subscription_destination_params))
    persist(:new, t(".notice"))
  end

  def update
    @subscription_destination.assign_attributes(subscription_destination_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    if @subscription_destination.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def delete
    if @subscription_destination.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def destroy_all
    authorize(SubscriptionDestination)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(SubscriptionDestination)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_connection
    return if params[:connection_id].blank?

    @connection = policy_scope(Connection).find(params.expect(:connection_id))
    set_context(connection: @connection)
    add_breadcrumb(text: @connection, path: @connection)
  end

  def load_delivery_channel
    return if params[:delivery_channel_id].blank?

    @delivery_channel =
      policy_scope(DeliveryChannel).find(params.expect(:delivery_channel_id))
    set_context(delivery_channel: @delivery_channel)
    add_breadcrumb(text: @delivery_channel, path: @delivery_channel)
  end

  def load_delivery_destination
    return if params[:delivery_destination_id].blank?

    @delivery_destination =
      policy_scope(DeliveryDestination).find(
        params.expect(:delivery_destination_id)
      )
    set_context(delivery_destination: @delivery_destination)
    add_breadcrumb(text: @delivery_destination, path: @delivery_destination)
  end

  def load_plan
    return if params[:plan_id].blank?

    @plan = policy_scope(Plan).find(params.expect(:plan_id))
    set_context(plan: @plan)
    add_breadcrumb(text: @plan, path: @plan)
  end

  def load_service
    return if params[:service_id].blank?

    @service = policy_scope(Service).find(params.expect(:service_id))
    set_context(service: @service)
    add_breadcrumb(text: @service, path: @service)
  end

  def load_subscription
    return if params[:subscription_id].blank?

    @subscription =
      policy_scope(Subscription).find(params.expect(:subscription_id))
    set_context(subscription: @subscription)
    add_breadcrumb(text: @subscription, path: @subscription)
  end

  def load_user
    return if params[:user_id].blank?

    @user =
      policy_scope(User).find(
        (
          if params.expect(:user_id) == "me"
            current_user&.id
          else
            params.expect(:user_id)
          end
        )
      )
    set_context(user: @user)
    add_breadcrumb(text: @user, path: @user)
  end

  def parent_params
    {
      connection_id: @connection&.id,
      delivery_channel_id: @delivery_channel&.id,
      delivery_destination_id: @delivery_destination&.id,
      plan_id: @plan&.id,
      service_id: @service&.id,
      subscription_id: @subscription&.id,
      user_id: @user&.id
    }.compact
  end

  def scope
    records = searched_policy_scope(SubscriptionDestination)
    records = records.where_connection(@connection) if @connection
    if @delivery_channel
      records = records.where_delivery_channel(@delivery_channel)
    end
    if @delivery_destination
      records = records.where_delivery_destination(@delivery_destination)
    end
    records = records.where_plan(@plan) if @plan
    records = records.where_service(@service) if @service
    records = records.where_subscription(@subscription) if @subscription
    records = records.where_user(@user) if @user
    records
  end

  def model_class = SubscriptionDestination
  def model_instance = @subscription_destination
  def nested = []
  def filters = []

  def load_subscription_destination
    @subscription_destination = authorize(scope.find(params.expect(:id)))
    set_context(subscription_destination: @subscription_destination)
    add_breadcrumb(text: @subscription_destination, path: show_url)
  end

  def subscription_destination_params
    return {} unless admin?

    params.expect(
      subscription_destination: %i[
        subscription_id
        delivery_destination_id
        amount_cents
        amount_currency
        active
        selected
      ]
    )
  end
end
