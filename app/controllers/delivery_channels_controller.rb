# frozen_string_literal: true

class DeliveryChannelsController < ApplicationController
  before_action do
    add_breadcrumb(key: "delivery_channels.index", path: index_url)
  end
  before_action :load_delivery_channel,
                only: %i[show edit update destroy delete]

  def index
    authorize(DeliveryChannel)
    @delivery_channels = scope.order(:id).page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_channels }
      end
    end
  end

  def show
    @logs =
      policy_scope(Log)
        .where_delivery_channel(@delivery_channel)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where_delivery_channel(@delivery_channel)
        .order(created_at: :desc)
        .page(params[:page])
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_channel }
      end
    end
  end

  def new
    @delivery_channel = authorize(scope.new)
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_channel }
      end
    end
  end

  def edit
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render json: { status: :ok, messages: [], data: @delivery_channel }
      end
    end
  end

  def create
    @delivery_channel = authorize(scope.new(delivery_channel_params))
    persist(:new, t(".notice"))
  end

  def update
    @delivery_channel.assign_attributes(delivery_channel_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    if @delivery_channel.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def delete
    if @delivery_channel.destroy
      respond_after_delete(t(".notice"))
    else
      respond_after_invalid(:edit)
    end
  end

  def destroy_all
    authorize(DeliveryChannel)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(DeliveryChannel)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def scope = searched_policy_scope(DeliveryChannel)
  def model_class = DeliveryChannel
  def model_instance = @delivery_channel
  def nested = []
  def filters = []

  def load_delivery_channel
    @delivery_channel = authorize(scope.find(params.expect(:id)))
    set_context(delivery_channel: @delivery_channel)
    add_breadcrumb(text: @delivery_channel, path: show_url)
  end

  def delivery_channel_params
    return {} unless admin?

    params.expect(
      delivery_channel: %i[
        key
        enabled
        amount_cents
        show_recipient
        show_visibility
        amount_currency
        delivery_connection_id
        messaging_service_sid
        content_sid_en
        content_sid_fr
        callback_base_url
        only
        public_pattern
        private_pattern
        show_connection
      ]
    )
  end
end
