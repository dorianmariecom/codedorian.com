# frozen_string_literal: true

class PlansController < ApplicationController
  before_action(:load_service)
  before_action { add_breadcrumb(key: "plans.index", path: index_url) }
  before_action :load_plan, only: %i[show edit update destroy delete]

  def index
    authorize(Plan)
    @plans = scope.page(params[:page]).order(created_at: :desc)
    @plan_schedules = policy_scope(PlanSchedule)
    @subscriptions = policy_scope(Subscription)

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @plans }) }
    end
  end

  def show
    @plan_fields =
      policy_scope(PlanField)
        .where_plan(@plan)
        .order(:position, :id)
        .page(params[:page])
    @plan_schedules =
      policy_scope(PlanSchedule)
        .where_plan(@plan)
        .order(created_at: :desc)
        .page(params[:page])
    @subscriptions =
      policy_scope(Subscription)
        .where_plan(@plan)
        .order(created_at: :desc)
        .page(params[:page])
    @subscription_executions =
      policy_scope(SubscriptionExecution)
        .where_plan(@plan)
        .order(created_at: :desc)
        .page(params[:page])
    @steps =
      policy_scope(Step)
        .where_service(@plan.service)
        .order(:position)
        .page(params[:page])
    @step_executions =
      policy_scope(StepExecution)
        .where_plan(@plan)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where_plan(@plan)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_plan(@plan)
        .order(created_at: :desc)
        .page(params[:page])

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @plan }) }
    end
  end

  def new
    @plan =
      authorize(
        scope.new(
          params.fetch(:plan, ActionController::Parameters.new).permit(
            :service_id
          )
        )
      )
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @plan }) }
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @plan }) }
    end
  end

  def create
    @plan = authorize(scope.new(plan_params))
    persist(:new, t(".notice"))
  end

  def update
    @plan.assign_attributes(plan_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @plan.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @plan.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(Plan)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(Plan)
    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def scope
    records = searched_policy_scope(Plan)
    records = records.where_service(@service) if @service
    records
  end

  def model_class = Plan
  def model_instance = @plan
  def nested = []
  def index_context_records = [@service]
  def filters = []

  def load_service
    return if params[:service_id].blank?

    @service = policy_scope(Service).find(params.expect(:service_id))
    set_context(service: @service)
  end

  def load_plan
    @plan = authorize(scope.find(params.expect(:id)))
    set_context(plan: @plan)
    add_breadcrumb(text: @plan, path: show_url)
  end

  def plan_params
    params.expect(
      plan: [
        :service_id,
        :name_en,
        :name_fr,
        :description_en,
        :description_fr,
        :body_en,
        :body_fr,
        :pricing_input,
        :slug,
        { plan_schedules_attributes: [%i[id _destroy starts_at interval]] },
        {
          plan_fields_attributes: [
            %i[id _destroy key name_en name_fr kind required position]
          ]
        }
      ]
    )
  end
end
