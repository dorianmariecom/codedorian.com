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
  end

  def show
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
  end

  def edit = add_breadcrumb

  def create
    @subscription_value = authorize(scope.new(subscription_value_params))
    if @subscription_value.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @subscription_value.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @subscription_value.assign_attributes(subscription_value_params)
    if @subscription_value.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @subscription_value.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @subscription_value.destroy!
    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @subscription_value.delete
    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(SubscriptionValue)
    scope.destroy_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(SubscriptionValue)
    scope.delete_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope
    records = searched_policy_scope(SubscriptionValue)
    records = records.where(subscription: @subscription) if @subscription
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
