# frozen_string_literal: true

class DeliveriesController < ApplicationController
  before_action :load_connection
  before_action :load_delivery_channel
  before_action :load_delivery_destination
  before_action :load_plan
  before_action :load_service
  before_action :load_step
  before_action :load_step_execution
  before_action :load_subscription
  before_action :load_subscription_execution
  before_action :load_user
  before_action { add_breadcrumb(key: "deliveries.index", path: index_url) }
  before_action :load_delivery,
                only: %i[show edit update destroy delete retry reconcile]

  def index
    authorize(Delivery)
    @deliveries = scope.order(created_at: :desc).page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @deliveries }
      end
    end
  end

  def show
    @logs =
      policy_scope(Log)
        .where_delivery(@delivery)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where_delivery(@delivery)
        .order(created_at: :desc)
        .page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery }
      end
    end
  end

  def new
    @delivery = authorize(scope.new)
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery }
      end
    end
  end

  def edit
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery }
      end
    end
  end

  def create
    @delivery = authorize(scope.new(delivery_params))
    persist(:new, t(".notice"))
  end

  def update
    @delivery.assign_attributes(delivery_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    if @delivery.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def delete
    if @delivery.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def destroy_all
    authorize(Delivery)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(Delivery)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def retry
    @delivery.reset!
    respond_after_persist(t(".notice"))
  end

  def reconcile
    @delivery.reconcile!(params.expect(:outcome))
    respond_after_persist(t(".notice"))
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

  def load_step
    return if params[:step_id].blank?

    @step = policy_scope(Step).find(params.expect(:step_id))
    set_context(step: @step)
    add_breadcrumb(text: @step, path: @step)
  end

  def load_step_execution
    return if params[:step_execution_id].blank?

    @step_execution =
      policy_scope(StepExecution).find(params.expect(:step_execution_id))
    set_context(step_execution: @step_execution)
    add_breadcrumb(text: @step_execution, path: @step_execution)
  end

  def load_subscription
    return if params[:subscription_id].blank?

    @subscription =
      policy_scope(Subscription).find(params.expect(:subscription_id))
    set_context(subscription: @subscription)
    add_breadcrumb(text: @subscription, path: @subscription)
  end

  def load_subscription_execution
    return if params[:subscription_execution_id].blank?

    @subscription_execution =
      policy_scope(SubscriptionExecution).find(
        params.expect(:subscription_execution_id)
      )
    set_context(subscription_execution: @subscription_execution)
    add_breadcrumb(text: @subscription_execution, path: @subscription_execution)
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
      step_id: @step&.id,
      step_execution_id: @step_execution&.id,
      subscription_id: @subscription&.id,
      subscription_execution_id: @subscription_execution&.id,
      user_id: @user&.id
    }.compact
  end

  def scope
    records = searched_policy_scope(Delivery)
    records = records.where_connection(@connection) if @connection
    if @delivery_channel
      records = records.where_delivery_channel(@delivery_channel)
    end
    if @delivery_destination
      records = records.where_delivery_destination(@delivery_destination)
    end
    records = records.where_plan(@plan) if @plan
    records = records.where_service(@service) if @service
    records = records.where_step(@step) if @step
    records = records.where_step_execution(@step_execution) if @step_execution
    records = records.where_subscription(@subscription) if @subscription
    if @subscription_execution
      records = records.where_subscription_execution(@subscription_execution)
    end
    records = records.where_user(@user) if @user
    records
  end

  def model_class = Delivery
  def model_instance = @delivery
  def nested = []
  def filters = []

  def load_delivery
    @delivery = authorize(scope.find(params.expect(:id)))
    set_context(delivery: @delivery)
    add_breadcrumb(text: @delivery, path: show_url)
  end

  def delivery_params
    return {} unless admin?

    params.expect(
      delivery: %i[
        subscription_id
        delivery_destination_id
        step_execution_id
        event_key
        status
        provider_id
        error_code
        subject
        body_text
        body_html
        url
        locale
      ]
    )
  end
end
