# frozen_string_literal: true

class DeliveriesController < ApplicationController
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

  def scope = searched_policy_scope(Delivery)
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
