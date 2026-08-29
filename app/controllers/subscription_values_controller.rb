# frozen_string_literal: true

class SubscriptionValuesController < ApplicationController
  before_action(:load_subscription)
  before_action do
    add_breadcrumb(key: "subscription_values.index", path: index_url)
  end
  before_action :load_subscription_value,
                only: %i[show edit update destroy delete]

  def index
    authorize(SubscriptionValue)
    @subscription_values = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @subscription_values })
      end
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @subscription_value })
      end
    end
  end

  def new
    @subscription_value =
      authorize(
        scope.new(
          params.fetch(
            :subscription_value,
            ActionController::Parameters.new
          ).permit(:subscription_id)
        )
      )
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @subscription_value })
      end
    end
  end

  def edit
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @subscription_value })
      end
    end
  end

  def create
    @subscription_value = authorize(scope.new(subscription_value_params))
    if @subscription_value.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @subscription_value
            }
          )
        end
      end
    else
      flash.now.alert = @subscription_value.alert
      respond_to do |format|
        format.html { render(:new, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@subscription_value.alert],
              data: @subscription_value
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def update
    @subscription_value.assign_attributes(subscription_value_params)
    if @subscription_value.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @subscription_value
            }
          )
        end
      end
    else
      flash.now.alert = @subscription_value.alert
      respond_to do |format|
        format.html { render(:edit, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@subscription_value.alert],
              data: @subscription_value
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def destroy
    @subscription_value.destroy!
    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @subscription_value
          }
        )
      end
    end
  end

  def delete
    @subscription_value.delete
    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @subscription_value
          }
        )
      end
    end
  end

  def destroy_all
    authorize(SubscriptionValue)
    scope.destroy_all
    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }
      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def delete_all
    authorize(SubscriptionValue)
    scope.delete_all
    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }
      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  private

  def scope
    records = searched_policy_scope(SubscriptionValue)
    records = records.where_subscription(@subscription) if @subscription
    records
  end

  def model_class = SubscriptionValue
  def model_instance = @subscription_value
  def nested = []
  def index_context_records = [@subscription]
  def filters = []

  def load_subscription
    return if params[:subscription_id].blank?

    @subscription =
      policy_scope(Subscription).find(params.expect(:subscription_id))
    set_context(subscription: @subscription)
  end

  def load_subscription_value
    @subscription_value = authorize(scope.find(params.expect(:id)))
    set_context(subscription_value: @subscription_value)
    add_breadcrumb(text: @subscription_value, path: show_url)
  end

  def subscription_value_params
    if admin?
      params.expect(subscription_value: %i[subscription_id key value])
    else
      params.expect(subscription_value: %i[key value])
    end
  end
end
