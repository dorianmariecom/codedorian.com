# frozen_string_literal: true

class JobRecurringTasksController < ApplicationController
  before_action do
    add_breadcrumb(key: "job_recurring_tasks.index", path: index_url)
  end
  before_action(
    :load_job_recurring_task,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(JobRecurringTask)

    @job_recurring_tasks = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_recurring_tasks })
      end
    end
  end

  def show
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_recurring_task })
      end
    end
  end

  def new
    @job_recurring_task = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_recurring_task })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_recurring_task })
      end
    end
  end

  def create
    @job_recurring_task = authorize(scope.new(job_recurring_task_params))
    persist(:new, t(".notice"))
  end

  def update
    @job_recurring_task.assign_attributes(job_recurring_task_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @job_recurring_task.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @job_recurring_task.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(JobRecurringTask)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(JobRecurringTask)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_job_recurring_task
    @job_recurring_task = authorize(scope.find(id))
    set_context(job_recurring_task: @job_recurring_task)
    add_breadcrumb(text: @job_recurring_task, path: show_url)
  end

  def id
    params[:job_recurring_task_id].presence || params[:id]
  end

  def scope
    searched_policy_scope(JobRecurringTask)
  end

  def logs_scope
    scope = policy_scope(Log)
    if @job_recurring_task
      scope = scope.where_job_recurring_task(@job_recurring_task)
    end
    scope
  end

  def model_class
    JobRecurringTask
  end

  def model_instance
    @job_recurring_task
  end

  def nested
    []
  end

  def filters
    []
  end

  def job_recurring_task_params
    if admin?
      params.expect(
        job_recurring_task: %i[
          key
          class_name
          command
          schedule
          queue_name
          priority
          static
          arguments
          description
        ]
      )
    else
      {}
    end
  end
end
