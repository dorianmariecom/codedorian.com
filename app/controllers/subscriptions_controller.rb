# frozen_string_literal: true

class SubscriptionsController < ApplicationController
  before_action { add_breadcrumb(key: "subscriptions.index", path: index_url) }
  before_action :load_subscription, only: %i[
    show edit update destroy delete activate deactivate evaluate
  ]

  def index
    authorize(Subscription)
    @subscriptions = scope.page(params[:page]).order(created_at: :desc)
    @subscription_executions = policy_scope(SubscriptionExecution)
  end

  def show
    @subscription_executions = policy_scope(SubscriptionExecution).where(subscription: @subscription).order(created_at: :desc).page(params[:page])
    @versions = policy_scope(Version).where(item: @subscription).order(created_at: :desc).page(params[:page])
    @logs = policy_scope(Log).where_subscription(@subscription).order(created_at: :desc).page(params[:page])
  end

  def evaluate
    perform_later(
      SubscriptionEvaluateJob,
      arguments: { subscription: @subscription },
      context: {
        current_user: current_user,
        user: @subscription.user,
        subscription: @subscription
      },
      current: {
        user: current_user,
        subscription: @subscription,
        locale: I18n.locale,
        time_zone: current_time_zone
      }
    )

    redirect_back_or_to(show_url, notice: t(".notice"))
  end

  def activate
    @subscription.activate!

    redirect_back_or_to(show_url, notice: t(".notice"))
  end

  def deactivate
    @subscription.deactivate!

    redirect_back_or_to(show_url, notice: t(".notice"))
  end

  def new
    @subscription = authorize(
      scope.new(
        params
          .fetch(:subscription, ActionController::Parameters.new)
          .permit(:plan_id)
      )
    )
    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @subscription = authorize(scope.new(subscription_params))
    if @subscription.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @subscription.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @subscription.assign_attributes(subscription_params)
    if @subscription.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @subscription.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @subscription.destroy!
    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @subscription.delete
    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Subscription)
    scope.destroy_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Subscription)
    scope.delete_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope = searched_policy_scope(Subscription)
  def model_class = Subscription
  def model_instance = @subscription
  def nested = []
  def filters = []

  def load_subscription
    @subscription = authorize(scope.find(params.expect(:id)))
    set_context(subscription: @subscription)
    add_breadcrumb(text: @subscription, path: show_url)
  end

  def subscription_params
    params.expect(subscription: %i[user_id plan_id status])
  end
end
