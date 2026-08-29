# frozen_string_literal: true

class StepExecutionsController < ApplicationController
  before_action(:load_service)
  before_action(:load_plan)
  before_action(:load_subscription)
  before_action(:load_subscription_execution_context)
  before_action(:load_step)
  before_action do
    add_breadcrumb(key: "step_executions.index", path: index_url)
  end
  before_action :load_step_execution, only: %i[show edit update destroy delete]

  def index
    authorize(StepExecution)
    @step_executions = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @step_executions })
      end
    end
  end

  def show
    @versions =
      policy_scope(Version)
        .where_step_execution(@step_execution)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_step_execution(@step_execution)
        .order(created_at: :desc)
        .page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @step_execution })
      end
    end
  end

  def new
    @step_execution =
      authorize(
        scope.new(
          params.fetch(
            :step_execution,
            ActionController::Parameters.new
          ).permit(:subscription_execution_id, :step_id)
        )
      )
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @step_execution })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @step_execution })
      end
    end
  end

  def create
    @step_execution = authorize(scope.new(step_execution_params))
    if @step_execution.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @step_execution
            }
          )
        end
      end
    else
      flash.now.alert = @step_execution.alert
      respond_to do |format|
        format.html { render(:new, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@step_execution.alert],
              data: @step_execution
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def update
    @step_execution.assign_attributes(step_execution_params)
    if @step_execution.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @step_execution
            }
          )
        end
      end
    else
      flash.now.alert = @step_execution.alert
      respond_to do |format|
        format.html { render(:edit, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@step_execution.alert],
              data: @step_execution
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def destroy
    @step_execution.destroy!
    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @step_execution
          }
        )
      end
    end
  end

  def delete
    @step_execution.delete
    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @step_execution
          }
        )
      end
    end
  end

  def destroy_all
    authorize(StepExecution)
    scope.destroy_all
    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }
      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def delete_all
    authorize(StepExecution)
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
    records = searched_policy_scope(StepExecution)
    if @subscription_execution
      records = records.where_subscription_execution(@subscription_execution)
    end
    records = records.where_step(@step) if @step
    records = records.where_subscription(@subscription) if @subscription
    records = records.where_plan(@plan) if @plan
    records = records.where_service(@service) if @service
    records
  end

  def model_class = StepExecution
  def model_instance = @step_execution
  def nested = []

  def index_context_records
    [@service, @plan, @subscription, @subscription_execution, @step]
  end

  def filters = []

  def load_service
    return if params[:service_id].blank?

    @service = policy_scope(Service).find(params.expect(:service_id))
    set_context(service: @service)
  end

  def load_plan
    return if params[:plan_id].blank?

    plans = policy_scope(Plan)
    plans = plans.where_service(@service) if @service
    @plan = plans.find(params.expect(:plan_id))
    set_context(plan: @plan)
  end

  def load_subscription
    return if params[:subscription_id].blank?

    subscriptions = policy_scope(Subscription)
    subscriptions = subscriptions.where_plan(@plan) if @plan
    @subscription = subscriptions.find(params.expect(:subscription_id))
    set_context(subscription: @subscription)
  end

  def load_subscription_execution_context
    return if params[:subscription_execution_id].blank?

    executions = policy_scope(SubscriptionExecution)
    if @subscription
      executions = executions.where_subscription(@subscription)
    end
    @subscription_execution =
      executions.find(params.expect(:subscription_execution_id))
    set_context(subscription_execution: @subscription_execution)
  end

  def load_step
    return if params[:step_id].blank?

    steps = policy_scope(Step)
    steps = steps.where_service(@service) if @service
    @step = steps.find(params.expect(:step_id))
    set_context(step: @step)
  end

  def load_step_execution
    @step_execution = authorize(scope.find(params.expect(:id)))
    set_context(step_execution: @step_execution)
    add_breadcrumb(text: @step_execution, path: show_url)
  end

  def step_execution_params
    params.expect(
      step_execution: %i[
        subscription_execution_id
        step_id
        status
        input
        output
        error
        error_class
        error_message
        error_backtrace
        result
      ]
    )
  end
end
