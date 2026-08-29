# frozen_string_literal: true

class SubscriptionsController < ApplicationController
  before_action { add_breadcrumb(key: "subscriptions.index", path: index_url) }
  before_action(:load_service)
  before_action(:load_plan)
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
    @subscription_values =
      policy_scope(SubscriptionValue)
        .where(subscription: @subscription)
        .order(:id)
        .page(params[:page])
    @subscription_executions =
      policy_scope(SubscriptionExecution)
        .where(subscription: @subscription)
        .order(created_at: :desc)
        .page(params[:page])
    @step_executions =
      policy_scope(StepExecution)
        .joins(:subscription_execution)
        .where(subscription_executions: { subscription_id: @subscription.id })
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
    @subscription = authorize(scope.new(user: current_user, plan: @plan))
    @subscription.prepare_values
    add_breadcrumb
  end

  def edit
    @subscription.prepare_values
    add_breadcrumb
  end

  def create
    @subscription = authorize(scope.new(subscription_params))
    @subscription.assign_attributes(@subscription.plan.price_for(@subscription))
    if @subscription.save(context: :controller)
      redirect_to(
        subscription_billing_path(@subscription),
        notice: t(".notice")
      )
    else
      @subscription.prepare_values
      flash.now.alert = @subscription.alert
      render(:new, status: :unprocessable_content)
    end
  rescue StripeBilling::PricingError => e
    @subscription.errors.add(:base, e.message)
    @subscription.prepare_values
    flash.now.alert = @subscription.alert
    render(:new, status: :unprocessable_content)
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
    StripeBilling.destroy!(@subscription)
    @subscription.destroy!
    redirect_to(index_url, notice: t(".notice"))
  rescue Stripe::StripeError => e
    redirect_to(show_url, alert: e.message)
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
    if @service
      records = records.joins(:plan).where(plans: { service_id: @service.id })
    end
    records
  end

  def model_class = Subscription
  def model_instance = @subscription
  def nested = []
  def index_context_records = [@service, @plan]
  def filters = []

  def load_subscription
    @subscription = authorize(scope.find(id))
    set_context(subscription: @subscription)
    add_breadcrumb(text: @subscription, path: show_url)
  end

  def id
    params[:subscription_id].presence || params[:id]
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
    return if plan_id.blank?

    plans =
      (
        if @service
          policy_scope(Plan).where(service: @service)
        else
          policy_scope(Plan)
        end
      )
    @plan = plans.find(plan_id)
  end

  def plan_id
    params[:plan_id].presence || params.dig(:subscription, :plan_id)
  end
end
