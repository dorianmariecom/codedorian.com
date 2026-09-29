# frozen_string_literal: true

class JobRecurringExecutionsController < ApplicationController
  before_action :load_job_batch
  before_action :load_job_recurring_task
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_job)
  before_action do
    add_breadcrumb(key: "job_recurring_executions.index", path: index_url)
  end
  before_action(
    :load_job_recurring_execution,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(JobRecurringExecution)

    @job_recurring_executions =
      scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @job_recurring_executions
          }
        )
      end
    end
  end

  def show
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @job_recurring_execution
          }
        )
      end
    end
  end

  def new
    @job_recurring_execution = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @job_recurring_execution
          }
        )
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(
          json: {
            status: :ok,
            messages: [],
            data: @job_recurring_execution
          }
        )
      end
    end
  end

  def create
    @job_recurring_execution =
      authorize(scope.new(job_recurring_execution_params))
    persist(:new, t(".notice"))
  end

  def update
    @job_recurring_execution.assign_attributes(job_recurring_execution_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @job_recurring_execution.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @job_recurring_execution.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(JobRecurringExecution)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(JobRecurringExecution)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_job_batch
    return if params[:job_batch_id].blank?

    @job_batch = policy_scope(JobBatch).find(params.expect(:job_batch_id))
    set_context(job_batch: @job_batch)
    add_breadcrumb(text: @job_batch, path: @job_batch)
  end

  def load_job_recurring_task
    return if params[:job_recurring_task_id].blank?

    @job_recurring_task =
      policy_scope(JobRecurringTask).find(params.expect(:job_recurring_task_id))
    set_context(job_recurring_task: @job_recurring_task)
    add_breadcrumb(text: @job_recurring_task, path: @job_recurring_task)
  end

  def parent_params
    {
      job_batch_id: @job_batch&.id,
      job_recurring_task_id: @job_recurring_task&.id
    }.compact
  end

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        policy_scope(Guest).find(current_guest&.id)
      else
        policy_scope(Guest).find(params.expect(:guest_id))
      end

    set_context(guest: @guest)
    add_breadcrumb(key: "guests.index", path: :guests)
    add_breadcrumb(text: @guest, path: @guest)
  end

  def load_user
    return if params[:user_id].blank?

    @user =
      if params[:user_id] == "me"
        policy_scope(User).find(current_user&.id)
      else
        policy_scope(User).find(params.expect(:user_id))
      end

    set_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def load_program
    return if params[:program_id].blank?

    @program = programs_scope.find(params.expect(:program_id))

    set_context(program: @program)
    add_breadcrumb(key: "programs.index", path: [@user, :programs])
    add_breadcrumb(text: @program, path: [@user, @program])
  end

  def load_job
    return if params[:job_id].blank?

    @job = jobs_scope.find(params.expect(:job_id))

    set_context(job: @job)
    add_breadcrumb(key: "jobs.index", path: [@user, :jobs])
    add_breadcrumb(text: @job, path: [@user, @job])
  end

  def id
    params[:job_recurring_execution_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(JobRecurringExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope = scope.where_job_batch(@job_batch) if @job_batch
    if @job_recurring_task
      scope = scope.where_job_recurring_task(@job_recurring_task)
    end
    scope
  end

  def programs_scope
    scope = policy_scope(Program)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def jobs_scope
    scope = policy_scope(Job)

    if @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def logs_scope
    scope = policy_scope(Log)

    if @job_recurring_execution
      scope = scope.where_job_recurring_execution(@job_recurring_execution)
    end

    scope
  end

  def model_class
    JobRecurringExecution
  end

  def model_instance
    @job_recurring_execution
  end

  def nested(user: @user, guest: @guest, program: @program, job: @job)
    [user || guest, program, job].compact
  end

  def filters
    %i[user program job]
  end

  def load_job_recurring_execution
    @job_recurring_execution = authorize(scope.find(id))
    set_context(job_recurring_execution: @job_recurring_execution)
    add_breadcrumb(text: @job_recurring_execution, path: show_url)
  end

  def job_recurring_execution_params
    if admin?
      params.expect(job_recurring_execution: %i[job_id task_key run_at])
    else
      {}
    end
  end
end
