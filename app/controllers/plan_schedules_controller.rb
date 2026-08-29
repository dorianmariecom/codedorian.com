# frozen_string_literal: true

class PlanSchedulesController < ApplicationController
  before_action(:load_plan)
  before_action { add_breadcrumb(key: "plan_schedules.index", path: index_url) }
  before_action :load_plan_schedule, only: %i[show edit update destroy delete]

  def index
    authorize(PlanSchedule)
    @plan_schedules = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @plan_schedules })
      end
    end
  end

  def show
    @versions =
      policy_scope(Version)
        .where_plan_schedule(@plan_schedule)
        .order(created_at: :desc)
        .page(params[:page])
    @logs =
      policy_scope(Log)
        .where_plan_schedule(@plan_schedule)
        .order(created_at: :desc)
        .page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @plan_schedule })
      end
    end
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

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @plan_schedule })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @plan_schedule })
      end
    end
  end

  def create
    @plan_schedule = authorize(scope.new(plan_schedule_params))
    if @plan_schedule.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @plan_schedule
            }
          )
        end
      end
    else
      flash.now.alert = @plan_schedule.alert
      respond_to do |format|
        format.html { render(:new, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@plan_schedule.alert],
              data: @plan_schedule
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def update
    @plan_schedule.assign_attributes(plan_schedule_params)
    if @plan_schedule.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @plan_schedule
            }
          )
        end
      end
    else
      flash.now.alert = @plan_schedule.alert
      respond_to do |format|
        format.html { render(:edit, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@plan_schedule.alert],
              data: @plan_schedule
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def destroy
    @plan_schedule.destroy!
    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @plan_schedule
          }
        )
      end
    end
  end

  def delete
    @plan_schedule.delete
    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }
      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @plan_schedule
          }
        )
      end
    end
  end

  def destroy_all
    authorize(PlanSchedule)
    scope.destroy_all
    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }
      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def delete_all
    authorize(PlanSchedule)
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
    records = searched_policy_scope(PlanSchedule)
    records = records.where_plan(@plan) if @plan
    records
  end

  def model_class = PlanSchedule
  def model_instance = @plan_schedule
  def nested = []
  def index_context_records = [@plan]
  def filters = []

  def load_plan
    return if params[:plan_id].blank?

    @plan = policy_scope(Plan).find(params.expect(:plan_id))
    set_context(plan: @plan)
  end

  def load_plan_schedule
    @plan_schedule = authorize(scope.find(params.expect(:id)))
    set_context(plan_schedule: @plan_schedule)
    add_breadcrumb(text: @plan_schedule, path: show_url)
  end

  def plan_schedule_params
    params.expect(plan_schedule: %i[plan_id starts_at interval])
  end
end
