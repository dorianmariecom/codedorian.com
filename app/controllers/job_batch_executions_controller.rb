# frozen_string_literal: true

class JobBatchExecutionsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_job)
  before_action do
    add_breadcrumb(key: "job_batch_executions.index", path: index_url)
  end
  before_action(
    :load_job_batch_execution,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(JobBatchExecution)

    @job_batch_executions = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_batch_executions })
      end
    end
  end

  def show
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_batch_execution })
      end
    end
  end

  def new
    @job_batch_execution = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_batch_execution })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_batch_execution })
      end
    end
  end

  def create
    @job_batch_execution = authorize(scope.new(job_batch_execution_params))
    persist(:new, t(".notice"))
  end

  def update
    @job_batch_execution.assign_attributes(job_batch_execution_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @job_batch_execution.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @job_batch_execution.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(JobBatchExecution)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(JobBatchExecution)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

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
    params[:job_batch_execution_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(JobBatchExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
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

    if @job_batch_execution
      scope = scope.where_job_batch_execution(@job_batch_execution)
    end

    scope
  end

  def model_class
    JobBatchExecution
  end

  def model_instance
    @job_batch_execution
  end

  def nested(user: @user, guest: @guest, program: @program, job: @job)
    [user || guest, program, job].compact
  end

  def filters
    %i[user program job]
  end

  def load_job_batch_execution
    @job_batch_execution = authorize(scope.find(id))
    set_context(job_batch_execution: @job_batch_execution)
    add_breadcrumb(text: @job_batch_execution, path: show_url)
  end

  def job_batch_execution_params
    admin? ? params.expect(job_batch_execution: %i[job_id batch_id]) : {}
  end
end
