# frozen_string_literal: true

class ExampleSchedulesController < ApplicationController
  before_action(:load_example)
  before_action do
    add_breadcrumb(key: "example_schedules.index", path: index_url)
  end
  before_action(
    :load_example_schedule,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(ExampleSchedule)

    @example_schedules = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @example_schedule = authorize(scope.new(example: @example))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @example_schedule = authorize(scope.new(example_schedule_params))

    if @example_schedule.save(context: :controller)
      log_in(@example_schedule.user)
      @user = @example_schedule.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @example_schedule.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @example_schedule.assign_attributes(example_schedule_params)

    if @example_schedule.save(context: :controller)
      log_in(@example_schedule.user)
      @user = @example_schedule.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @example_schedule.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @example_schedule.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @example_schedule.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(ExampleSchedule)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(ExampleSchedule)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  private

  def load_example
    return if params[:example_id].blank?

    @example = examples_scope.find(params[:example_id])

    set_context(example: @example)
    add_breadcrumb(key: "examples.index", path: [@user, :examples])
    add_breadcrumb(text: @example, path: [@user, @example])
  end

  def scope
    scope = searched_policy_scope(ExampleSchedule)
    scope = scope.where_example(@example) if @example
    scope
  end

  def examples_scope
    policy_scope(Example)
  end

  def model_class
    ExampleSchedule
  end

  def model_instance
    @example_schedule
  end

  def nested(example: @example)
    [example]
  end

  def filters
    [:example]
  end

  def id
    params[:example_schedule_id].presence || params[:id]
  end

  def load_example_schedule
    @example_schedule = authorize(scope.find(id))
    set_context(example_schedule: @example_schedule)
    add_breadcrumb(text: @example_schedule, path: show_url)
  end

  def example_schedule_params
    admin? ? params.expect(example_schedule: %i[starts_at interval]) : {}
  end
end
