# frozen_string_literal: true

class StepsController < ApplicationController
  before_action(:load_service)
  before_action { add_breadcrumb(key: "steps.index", path: index_url) }
  before_action :load_step, only: %i[show edit update destroy delete]

  def index
    authorize(Step)
    @steps = scope.page(params[:page]).order(created_at: :desc)
    @step_executions = policy_scope(StepExecution)
  end

  def show
    @step_executions =
      policy_scope(StepExecution)
        .where(step: @step)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where(item: @step)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_step(@step)
        .order(created_at: :desc)
        .page(params[:page])
  end

  def new
    @step =
      authorize(
        scope.new(
          params.fetch(:step, ActionController::Parameters.new).permit(
            :service_id
          )
        )
      )
    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @step = authorize(scope.new(step_params))
    if @step.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @step.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @step.assign_attributes(step_params)
    if @step.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @step.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @step.destroy!
    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @step.delete
    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Step)
    scope.destroy_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Step)
    scope.delete_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope
    records = searched_policy_scope(Step)
    records = records.where(service: @service) if @service
    records
  end
  def model_class = Step
  def model_instance = @step
  def nested = []
  def index_context_records = [@service]
  def filters = []

  def load_service
    return if params[:service_id].blank?

    @service = policy_scope(Service).find(params.expect(:service_id))
    set_context(service: @service)
  end

  def load_step
    @step = authorize(scope.find(params.expect(:id)))
    set_context(step: @step)
    add_breadcrumb(text: @step, path: show_url)
  end

  def step_params
    params.expect(
      step: %i[
        service_id
        name_en
        name_fr
        description_en
        description_fr
        body_en
        body_fr
        position
        input
        offset_seconds
      ]
    )
  end
end
