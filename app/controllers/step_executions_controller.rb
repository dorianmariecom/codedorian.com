# frozen_string_literal: true

class StepExecutionsController < ApplicationController
  before_action do
    add_breadcrumb(key: "step_executions.index", path: index_url)
  end
  before_action :load_step_execution, only: %i[show edit update destroy delete]

  def index
    authorize(StepExecution)
    @step_executions = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @versions =
      policy_scope(Version)
        .where(item: @step_execution)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_step_execution(@step_execution)
        .order(created_at: :desc)
        .page(params[:page])
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
  end

  def edit
    add_breadcrumb
  end

  def create
    @step_execution = authorize(scope.new(step_execution_params))
    if @step_execution.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @step_execution.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @step_execution.assign_attributes(step_execution_params)
    if @step_execution.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @step_execution.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @step_execution.destroy!
    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @step_execution.delete
    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(StepExecution)
    scope.destroy_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(StepExecution)
    scope.delete_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope = searched_policy_scope(StepExecution)
  def model_class = StepExecution
  def model_instance = @step_execution
  def nested = []
  def filters = []

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
