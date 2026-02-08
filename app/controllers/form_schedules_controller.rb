# frozen_string_literal: true

class FormSchedulesController < ApplicationController
  before_action { add_breadcrumb(key: "form_schedules.index", path: index_url) }
  before_action(:load_form_schedule, only: %i[show edit update destroy delete])

  def index
    authorize(FormSchedule)

    @form_schedules = scope.page(params[:page]).order(position: :asc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @form_schedule = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @form_schedule = authorize(scope.new(form_schedule_params))

    if @form_schedule.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @form_schedule.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @form_schedule.assign_attributes(form_schedule_params)

    if @form_schedule.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @form_schedule.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @form_schedule.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @form_schedule.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(FormSchedule)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(FormSchedule)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope
    searched_policy_scope(FormSchedule)
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_form_schedule(@form_schedule) if @form_schedule
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_form_schedule(@form_schedule) if @form_schedule
    scope
  end

  def model_class
    FormSchedule
  end

  def model_instance
    @form_schedule
  end

  def nested
    []
  end

  def filters
    []
  end

  def id
    params[:form_schedule_id].presence || params[:id]
  end

  def load_form_schedule
    @form_schedule = authorize(scope.find(id))
    set_context(form_schedule: @form_schedule)
    add_breadcrumb(text: @form_schedule, path: show_url)
  end

  def form_schedule_params
    if admin?
      params.expect(
        form_schedule: %i[locale starts_at interval name description position]
      )
    else
      {}
    end
  end
end
