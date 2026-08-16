# frozen_string_literal: true

class PlansController < ApplicationController
  before_action { add_breadcrumb(key: "plans.index", path: index_url) }
  before_action :load_plan, only: %i[show edit update destroy delete]

  def index
    authorize(Plan)
    @plans = scope.page(params[:page]).order(created_at: :desc)
    @plan_schedules = policy_scope(PlanSchedule)
    @subscriptions = policy_scope(Subscription)
  end

  def show
    @plan_schedules =
      policy_scope(PlanSchedule)
        .where(plan: @plan)
        .order(created_at: :desc)
        .page(params[:page])
    @subscriptions =
      policy_scope(Subscription)
        .where(plan: @plan)
        .order(created_at: :desc)
        .page(params[:page])
    @versions =
      policy_scope(Version)
        .where(item: @plan)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_plan(@plan)
        .order(created_at: :desc)
        .page(params[:page])
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
  end

  def edit
    add_breadcrumb
  end

  def create
    @plan = authorize(scope.new(plan_params))
    if @plan.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @plan.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @plan.assign_attributes(plan_params)
    if @plan.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @plan.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @plan.destroy!
    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @plan.delete
    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Plan)
    scope.destroy_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Plan)
    scope.delete_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope = searched_policy_scope(Plan)
  def model_class = Plan
  def model_instance = @plan
  def nested = []
  def filters = []

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
        { plan_schedules_attributes: [%i[id _destroy starts_at interval]] }
      ]
    )
  end
end
