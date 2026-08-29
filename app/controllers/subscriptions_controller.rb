# frozen_string_literal: true

class SubscriptionsController < ApplicationController
  before_action { add_breadcrumb(key: "subscriptions.index", path: index_url) }
  before_action(:load_service)
  before_action :load_plans, only: %i[new create]
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

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @subscriptions })
      end
    end
  end

  def show
    @subscription_values =
      policy_scope(SubscriptionValue)
        .where_subscription(@subscription)
        .order(:id)
        .page(params[:page])
    @subscription_executions =
      policy_scope(SubscriptionExecution)
        .where_subscription(@subscription)
        .order(created_at: :desc)
        .page(params[:page])
    @step_executions =
      policy_scope(StepExecution)
        .where_subscription(@subscription)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where_subscription(@subscription)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_subscription(@subscription)
        .order(created_at: :desc)
        .page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @subscription })
      end
    end
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

    respond_to do |format|
      format.html { redirect_back_or_to(show_url, notice: t(".notice")) }

      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @subscription
          }
        )
      end
    end
  end

  def activate
    @subscription.activate!

    respond_to do |format|
      format.html { redirect_back_or_to(show_url, notice: t(".notice")) }

      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @subscription
          }
        )
      end
    end
  end

  def deactivate
    @subscription.deactivate!

    respond_to do |format|
      format.html { redirect_back_or_to(show_url, notice: t(".notice")) }

      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @subscription
          }
        )
      end
    end
  end

  def new
    @subscription = authorize(scope.new(user: current_user, plan: @plan))
    @subscription.prepare_values
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @subscription })
      end
    end
  end

  def edit
    @subscription.prepare_values
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @subscription })
      end
    end
  end

  def create
    @subscription = authorize(scope.new(subscription_params))
    created =
      Subscription.transaction do
        unless @subscription.save(context: :controller)
          raise ActiveRecord::Rollback
        end

        @subscription.update!(@subscription.plan.price_for(@subscription))
        true
      end

    if created
      respond_after_persist(
        t(".notice"),
        redirect_url: subscription_billing_path(@subscription)
      )
    else
      @subscription.prepare_values
      respond_after_invalid(:new)
    end
  rescue StripeBilling::PricingError => e
    @subscription.errors.add(:base, e.message)
    @subscription.prepare_values
    respond_after_invalid(:new)
  end

  def update
    @subscription.assign_attributes(subscription_params)
    if @subscription.save(context: :controller)
      respond_after_persist(t(".notice"))
    else
      @subscription.prepare_values
      respond_after_invalid(:edit)
    end
  end

  def destroy
    StripeBilling.destroy!(@subscription)
    @subscription.destroy!
    respond_after_delete(t(".notice"))
  rescue Stripe::StripeError => e
    respond_to do |format|
      format.html { redirect_to(show_url, alert: e.message) }
      format.json do
        render(
          json: {
            status: :bad_request,
            messages: [e.message],
            data: @subscription
          },
          status: :bad_request
        )
      end
    end
  end

  def delete
    @subscription.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(Subscription)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(Subscription)
    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def scope
    records = searched_policy_scope(Subscription)
    records = records.where_plan(@plan) if @plan
    records = records.where_service(@service) if @service
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

    plans = @plans || policy_scope(Plan)
    plans = plans.where_service(@service) if @service
    @plan = plans.find(plan_id)
  end

  def load_plans
    @plans = policy_scope(Plan)
    @plans = @plans.where_service(@service) if @service
    @plans = @plans.order(:id)
  end

  def plan_id
    params[:plan_id].presence || params.dig(:subscription, :plan_id)
  end
end
