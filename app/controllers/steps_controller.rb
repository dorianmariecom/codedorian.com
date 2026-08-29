# frozen_string_literal: true

class StepsController < ApplicationController
  before_action(:load_service)
  before_action { add_breadcrumb(key: "steps.index", path: index_url) }
  before_action :load_step, only: %i[show edit update destroy delete format]

  def index
    authorize(Step)
    @steps = scope.page(params[:page]).order(created_at: :desc)
    @step_executions = policy_scope(StepExecution)

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @steps }) }
    end
  end

  def show
    @step_executions =
      policy_scope(StepExecution)
        .where_step(@step)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where_step(@step)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_step(@step)
        .order(created_at: :desc)
        .page(params[:page])

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @step }) }
    end
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

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @step }) }
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @step }) }
    end
  end

  def create
    @step = authorize(scope.new(step_params))
    if @step.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(json: { status: :ok, messages: [t(".notice")], data: @step })
        end
      end
    else
      flash.now.alert = @step.alert
      respond_to do |format|
        format.html { render(:new, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@step.alert],
              data: @step
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def update
    @step.assign_attributes(step_params)
    if @step.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(json: { status: :ok, messages: [t(".notice")], data: @step })
        end
      end
    else
      flash.now.alert = @step.alert
      respond_to do |format|
        format.html { render(:edit, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@step.alert],
              data: @step
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def format
    @step.format!
    redirect_back_or_to(show_url, notice: t(".notice"))
  rescue Code::Error => e
    redirect_back_or_to(show_url, alert: t(".alert", message: e.message))
  end

  def format_all
    authorize(Step)
    scope.format_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  rescue Code::Error => e
    redirect_back_or_to(index_url, alert: t(".alert", message: e.message))
  end

  def destroy
    @step.destroy!
    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }
      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: @step })
      end
    end
  end

  def delete
    @step.delete
    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }
      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: @step })
      end
    end
  end

  def destroy_all
    authorize(Step)
    scope.destroy_all
    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }
      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def delete_all
    authorize(Step)
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
    records = searched_policy_scope(Step)
    records = records.where_service(@service) if @service
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
