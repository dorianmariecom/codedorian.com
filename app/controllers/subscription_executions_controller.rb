# frozen_string_literal: true

class SubscriptionExecutionsController < ApplicationController
  before_action(:load_service)
  before_action(:load_plan)
  before_action(:load_subscription)
  before_action do
    add_breadcrumb(key: "subscription_executions.index", path: index_url)
  end
  before_action :load_subscription_execution,
                only: %i[show edit update destroy delete]

  def index
    authorize(SubscriptionExecution)
    @subscription_executions =
      scope.page(params[:page]).order(created_at: :desc)
    @step_executions = policy_scope(StepExecution)

    respond_to do |format|
      format.html
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @subscription_executions
          }
        )
      end
    end
  end

  def show
    @step_executions =
      policy_scope(StepExecution)
        .where(subscription_execution: @subscription_execution)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where(item: @subscription_execution)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_subscription_execution(@subscription_execution)
        .order(created_at: :desc)
        .page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @subscription_execution
          }
        )
      end
    end
  end

  def new
    @subscription_execution =
      authorize(
        scope.new(
          params.fetch(
            :subscription_execution,
            ActionController::Parameters.new
          ).permit(:subscription_id)
        )
      )
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @subscription_execution
          }
        )
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @subscription_execution
          }
        )
      end
    end
  end

  def create
    @subscription_execution =
      authorize(scope.new(subscription_execution_params))
    if @subscription_execution.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @subscription_execution
            }
          )
        end
      end
    else
      flash.now.alert = @subscription_execution.alert
      respond_to do |format|
        format.html { render(:new, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@subscription_execution.alert],
              data: @subscription_execution
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def update
    @subscription_execution.assign_attributes(subscription_execution_params)
    if @subscription_execution.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @subscription_execution
            }
          )
        end
      end
    else
      flash.now.alert = @subscription_execution.alert
      respond_to do |format|
        format.html { render(:edit, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@subscription_execution.alert],
              data: @subscription_execution
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def destroy
    @subscription_execution.destroy!
    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @subscription_execution
          }
        )
      end
    end
  end

  def delete
    @subscription_execution.delete
    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @subscription_execution
          }
        )
      end
    end
  end

  def destroy_all
    authorize(SubscriptionExecution)
    scope.destroy_all
    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }
      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def delete_all
    authorize(SubscriptionExecution)
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
    records = searched_policy_scope(SubscriptionExecution)
    records = records.where(subscription: @subscription) if @subscription
    if @plan
      records =
        records.joins(:subscription).where(subscriptions: { plan_id: @plan.id })
    end
    if @service
      records =
        records.joins(subscription: :plan).where(
          plans: {
            service_id: @service.id
          }
        )
    end
    records
  end

  def model_class = SubscriptionExecution
  def model_instance = @subscription_execution
  def nested = []
  def index_context_records = [@service, @plan, @subscription]
  def filters = []

  def load_service
    return if params[:service_id].blank?

    @service = policy_scope(Service).find(params.expect(:service_id))
    set_context(service: @service)
  end

  def load_plan
    return if params[:plan_id].blank?

    plans = policy_scope(Plan)
    plans = plans.where(service: @service) if @service
    @plan = plans.find(params.expect(:plan_id))
    set_context(plan: @plan)
  end

  def load_subscription
    return if params[:subscription_id].blank?

    subscriptions = policy_scope(Subscription)
    subscriptions = subscriptions.where(plan: @plan) if @plan
    @subscription = subscriptions.find(params.expect(:subscription_id))
    set_context(subscription: @subscription)
  end

  def load_subscription_execution
    @subscription_execution = authorize(scope.find(params.expect(:id)))
    set_context(subscription_execution: @subscription_execution)
    add_breadcrumb(text: @subscription_execution, path: show_url)
  end

  def subscription_execution_params
    params.expect(subscription_execution: %i[subscription_id status])
  end
end
