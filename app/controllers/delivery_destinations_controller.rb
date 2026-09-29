# frozen_string_literal: true

class DeliveryDestinationsController < ApplicationController
  before_action :load_connection,
                except: %i[
                  verification
                  confirm_verification
                  request_verification
                ]
  before_action :load_delivery_channel,
                except: %i[
                  verification
                  confirm_verification
                  request_verification
                ]
  before_action :load_plan,
                except: %i[
                  verification
                  confirm_verification
                  request_verification
                ]
  before_action :load_service,
                except: %i[
                  verification
                  confirm_verification
                  request_verification
                ]
  before_action :load_subscription,
                except: %i[
                  verification
                  confirm_verification
                  request_verification
                ]
  before_action :load_user,
                except: %i[
                  verification
                  confirm_verification
                  request_verification
                ]
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
      respond_verification(
        :confirmed,
        path: verification_subscription_path(record)
      )
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
      plan_id: @plan&.id,
      service_id: @service&.id,
      subscription_id: @subscription&.id,
      user_id: @user&.id
    }.compact
  end

  def verification_subscription_path(destination)
    return root_path unless current_user

    subscriptions =
      policy_scope(Subscription).where(
        id:
          destination.subscription_destinations.selected.select(
            :subscription_id
          )
      )
    subscription =
      if params[:subscription_id].present?
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

  def scope
    records = searched_policy_scope(DeliveryDestination)
    records = records.where_connection(@connection) if @connection
    if @delivery_channel
      records = records.where_delivery_channel(@delivery_channel)
    end
    records = records.where_plan(@plan) if @plan
    records = records.where_service(@service) if @service
    records = records.where_subscription(@subscription) if @subscription
    records = records.where_user(@user) if @user
    records
  end

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
          connection_id
          recipient
          visibility
          enabled
        ]
      )
    attributes.delete(:user_id) unless admin?
    attributes
  end
end
