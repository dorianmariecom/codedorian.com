# frozen_string_literal: true

class SubscriptionExecutionsController < ApplicationController
  before_action { add_breadcrumb(key: "subscription_executions.index", path: index_url) }
  before_action :load_subscription_execution, only: %i[show edit update destroy delete]

  def index
    authorize(SubscriptionExecution)
    @subscription_executions = scope.page(params[:page]).order(created_at: :desc)
    @step_executions = policy_scope(StepExecution)
  end

  def show
    @step_executions = policy_scope(StepExecution).where(subscription_execution: @subscription_execution).order(created_at: :desc).page(params[:page])
    @versions = policy_scope(Version).where(item: @subscription_execution).order(created_at: :desc).page(params[:page])
    @logs = policy_scope(Log).where_subscription_execution(@subscription_execution).order(created_at: :desc).page(params[:page])
  end

  def new
    @subscription_execution = authorize(
      scope.new(
        params
          .fetch(:subscription_execution, ActionController::Parameters.new)
          .permit(:subscription_id)
      )
    )
    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @subscription_execution = authorize(scope.new(subscription_execution_params))
    if @subscription_execution.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @subscription_execution.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @subscription_execution.assign_attributes(subscription_execution_params)
    if @subscription_execution.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @subscription_execution.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @subscription_execution.destroy!
    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @subscription_execution.delete
    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(SubscriptionExecution)
    scope.destroy_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(SubscriptionExecution)
    scope.delete_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope = searched_policy_scope(SubscriptionExecution)
  def model_class = SubscriptionExecution
  def model_instance = @subscription_execution
  def nested = []
  def filters = []

  def load_subscription_execution
    @subscription_execution = authorize(scope.find(params.expect(:id)))
    set_context(subscription_execution: @subscription_execution)
    add_breadcrumb(text: @subscription_execution, path: show_url)
  end

  def subscription_execution_params
    params.expect(subscription_execution: %i[subscription_id status])
  end
end
