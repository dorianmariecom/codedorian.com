# frozen_string_literal: true

class SubscriptionDestinationsController < ApplicationController
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

  def scope = searched_policy_scope(SubscriptionDestination)
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
