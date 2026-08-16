# frozen_string_literal: true

class PlanSchedulesController < ApplicationController
  before_action { add_breadcrumb(key: "plan_schedules.index", path: index_url) }
  before_action :load_plan_schedule, only: %i[show edit update destroy delete]

  def index
    authorize(PlanSchedule)
    @plan_schedules = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @versions =
      policy_scope(Version)
        .where(item: @plan_schedule)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_plan_schedule(@plan_schedule)
        .order(created_at: :desc)
        .page(params[:page])
  end

  def new
    @plan_schedule =
      authorize(
        scope.new(
          params.fetch(:plan_schedule, ActionController::Parameters.new).permit(
            :plan_id
          )
        )
      )
    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @plan_schedule = authorize(scope.new(plan_schedule_params))
    if @plan_schedule.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @plan_schedule.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @plan_schedule.assign_attributes(plan_schedule_params)
    if @plan_schedule.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @plan_schedule.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @plan_schedule.destroy!
    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @plan_schedule.delete
    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(PlanSchedule)
    scope.destroy_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(PlanSchedule)
    scope.delete_all
    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope = searched_policy_scope(PlanSchedule)
  def model_class = PlanSchedule
  def model_instance = @plan_schedule
  def nested = []
  def filters = []

  def load_plan_schedule
    @plan_schedule = authorize(scope.find(params.expect(:id)))
    set_context(plan_schedule: @plan_schedule)
    add_breadcrumb(text: @plan_schedule, path: show_url)
  end

  def plan_schedule_params
    params.expect(plan_schedule: %i[plan_id starts_at interval])
  end
end
