# frozen_string_literal: true

class SubscriptionsController < ApplicationController
  before_action { add_breadcrumb(key: "subscriptions.index", path: index_url) }
  before_action :load_service, only: %i[new create]
  before_action :load_plan, only: %i[new create]
  before_action :load_subscription,
                only: %i[
                  show
                  edit
                  update
                  destroy
                  delete
                  activate
                  deactivate
                  evaluate
                ]

  def index
    authorize(Subscription)
    @subscriptions = scope.page(params[:page]).order(created_at: :desc)
    @subscription_executions = policy_scope(SubscriptionExecution)
  end

  def show
    @subscription_executions =
      policy_scope(SubscriptionExecution)
        .where(subscription: @subscription)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where(item: @subscription)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_subscription(@subscription)
        .order(created_at: :desc)
        .page(params[:page])
  end

  def evaluate
    subscription_execution = @subscription.create_execution!

    perform_later(
      SubscriptionEvaluateJob,
      arguments: {
        subscription: @subscription,
        subscription_execution: subscription_execution
      },
      context: {
        current_user: current_user,
        user: @subscription.user,
        subscription: @subscription
      },
      current: {
        user: current_user,
        subscription: @subscription,
        subscription_execution: subscription_execution,
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
    @subscription = authorize(scope.new(user: current_user))
    @subscription.prepare_values
    add_breadcrumb
  end

  def edit
    @subscription.prepare_values
    add_breadcrumb
  end

  def create
    @subscription =
      if admin?
        authorize(scope.new(subscription_params))
      else
        authorize(scope.new(subscription_params.merge(user: current_user)))
      end
    if @subscription.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      @subscription.prepare_values
      flash.now.alert = @subscription.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @subscription.assign_attributes(subscription_params)
    if @subscription.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      @subscription.prepare_values
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

  def scope
    records = searched_policy_scope(Subscription)
    records = records.where(plan: @plan) if @plan
    records
  end

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
    if admin?
      params.expect(
        subscription: [
          :user_id,
          :plan_id,
          :status,
          { subscription_values_attributes: [%i[id _destroy key value]] }
        ]
      )
    else
      params.expect(
        subscription: [
          :status,
          { subscription_values_attributes: [%i[id _destroy key value]] }
        ]
      )
    end
  end

  def load_service
    return if params[:service_id].blank?

    @service = policy_scope(Service).find(params.expect(:service_id))
  end

  def load_plan
    return if params.dig(:subscription, :plan_id).blank?

    plans =
      (
        if @service
          policy_scope(Plan).where(service: @service)
        else
          policy_scope(Plan)
        end
      )
    @plan = plans.find(params.dig(:subscription, :plan_id))
  end
end
