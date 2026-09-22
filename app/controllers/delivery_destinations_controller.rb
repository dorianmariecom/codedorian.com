# frozen_string_literal: true

class DeliveryDestinationsController < ApplicationController
  VERIFICATION_REQUEST_LIMIT = 5
  VERIFICATION_REQUEST_WINDOW = 1.minute

  before_action :current_user!, only: :request_verification
  before_action only: %i[
    request_verification
    verification
    confirm_verification
  ] do
    no_store
    set_current_locale
  end
  rate_limit to: VERIFICATION_REQUEST_LIMIT,
             within: VERIFICATION_REQUEST_WINDOW,
             only: :request_verification

  before_action do
    add_breadcrumb(key: "delivery_destinations.index", path: index_url)
  end
  before_action :load_delivery_destination,
                only: %i[show edit update destroy delete]

  def request_verification
    subscription =
      authorize(
        policy_scope(Subscription).find(params.expect(:subscription_id)),
        :request_verification?
      )
    destination =
      authorize(
        policy_scope(DeliveryDestination).where_user(subscription.user).find(
          params.expect(:id)
        )
      )
    subscription.subscription_destinations.selected.find_by!(
      delivery_destination_id: destination.id
    )
    unless destination.recipient_verified?
      destination.request_verification!(
        url:
          verification_delivery_destination_url(
            id: destination,
            subscription_id: subscription.id,
            token: destination.verification_token
          )
      )
    end
    respond_verification(
      destination.recipient_verified? ? :already_verified : :sent,
      path: subscription_path(subscription)
    )
  end

  def verification
    record =
      policy_scope([:public, DeliveryDestination]).find_by_verification(
        params[:id],
        params[:token]
      )
    authorize([:public, record || DeliveryDestination])
    if record
      respond_verification(:confirmation)
    else
      respond_verification(:invalid, status: :unprocessable_content)
    end
  end

  def confirm_verification
    record =
      policy_scope([:public, DeliveryDestination]).find_by_verification(
        params[:id],
        params[:token]
      )
    authorize([:public, record || DeliveryDestination])
    if record&.confirm_verification(params[:token])
      respond_verification(:confirmed, path: verification_subscription_path(record))
    else
      respond_verification(:invalid, status: :unprocessable_content)
    end
  end

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

  def verification_subscription_path(destination)
    return root_path unless current_user

    subscriptions = policy_scope(Subscription).where(
      id: destination.subscription_destinations.selected.select(:subscription_id)
    )
    subscription = if params[:subscription_id].present?
      subscriptions.find_by(id: params[:subscription_id])
    else
      subscriptions.order(:id).first
    end

    if subscription && policy(subscription).show?
      subscription_path(subscription)
    else
      root_path
    end
  end

  def respond_verification(key, status: :ok, path: nil)
    @message = t(".#{key}")
    @confirmation = key == :confirmation
    respond_to do |format|
      format.html do
        if path
          redirect_to(path, notice: @message)
        else
          render :verification, status: status
        end
      end
      format.json do
        render json: {
                 status: status,
                 messages: [@message],
                 data: nil
               },
               status: status
      end
    end
  end

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
