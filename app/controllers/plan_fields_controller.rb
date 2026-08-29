# frozen_string_literal: true

class PlanFieldsController < ApplicationController
  before_action(:load_service)
  before_action(:load_plan)
  before_action { add_breadcrumb(key: "plan_fields.index", path: index_url) }
  before_action :load_plan_field, only: %i[show edit update destroy delete]

  def index
    authorize(PlanField)
    @plan_fields = scope.page(params[:page]).order(:plan_id, :position, :id)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @plan_fields })
      end
    end
  end

  def show
    @versions =
      policy_scope(Version)
        .where_plan_field(@plan_field)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_plan_field(@plan_field)
        .order(created_at: :desc)
        .page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @plan_field })
      end
    end
  end

  def new
    @plan_field =
      authorize(
        scope.new(
          params.fetch(:plan_field, ActionController::Parameters.new).permit(
            :plan_id
          )
        )
      )
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @plan_field })
      end
    end
  end

  def edit
    add_breadcrumb
    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @plan_field })
      end
    end
  end

  def create
    @plan_field = authorize(scope.new(plan_field_params))
    persist(:new, t(".notice"))
  end

  def update
    @plan_field.assign_attributes(plan_field_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @plan_field.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @plan_field.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(PlanField)
    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(PlanField)
    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def scope
    records = searched_policy_scope(PlanField)
    records = records.where_plan(@plan) if @plan
    records = records.where_service(@service) if @service
    records
  end

  def model_class = PlanField
  def model_instance = @plan_field
  def nested = []
  def index_context_records = [@service, @plan]
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

  def load_plan_field
    @plan_field = authorize(scope.find(params.expect(:id)))
    set_context(plan_field: @plan_field)
    add_breadcrumb(text: @plan_field, path: show_url)
  end

  def plan_field_params
    if admin?
      params.expect(
        plan_field: %i[plan_id key name_en name_fr kind required position]
      )
    else
      params.expect(plan_field: %i[key name_en name_fr kind required position])
    end
  end
end
