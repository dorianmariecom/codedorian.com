# frozen_string_literal: true

class JobClaimedExecutionsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_job)
  before_action do
    add_breadcrumb(key: "job_claimed_executions.index", path: index_url)
  end
  before_action(
    :load_job_claimed_execution,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(JobClaimedExecution)

    @job_claimed_executions = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @job_claimed_execution = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @job_claimed_execution = authorize(scope.new(job_claimed_execution_params))

    if @job_claimed_execution.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job_claimed_execution.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @job_claimed_execution.assign_attributes(job_claimed_execution_params)

    if @job_claimed_execution.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job_claimed_execution.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @job_claimed_execution.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @job_claimed_execution.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(JobClaimedExecution)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(JobClaimedExecution)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        policy_scope(Guest).find(current_guest&.id)
      else
        policy_scope(Guest).find(params[:guest_id])
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
        policy_scope(User).find(params[:user_id])
      end

    set_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def load_program
    return if params[:program_id].blank?

    @program = programs_scope.find(params[:program_id])

    set_context(program: @program)
    add_breadcrumb(key: "programs.index", path: [@user, :programs])
    add_breadcrumb(text: @program, path: [@user, @program])
  end

  def load_job
    return if params[:job_id].blank?

    @job = jobs_scope.find(params[:job_id])

    set_context(job: @job)
    add_breadcrumb(key: "jobs.index", path: [@user, :jobs])
    add_breadcrumb(text: @job, path: [@user, @job])
  end

  def id
    params[:job_claimed_execution_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(JobClaimedExecution)

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

    if @job_claimed_execution
      scope = scope.where_job_claimed_execution(@job_claimed_execution)
    end

    scope
  end

  def model_class
    JobClaimedExecution
  end

  def model_instance
    @job_claimed_execution
  end

  def nested(user: @user, guest: @guest, program: @program, job: @job)
    [user || guest, program, job].compact
  end

  def filters
    %i[user program job]
  end

  def load_job_claimed_execution
    @job_claimed_execution = authorize(scope.find(id))
    set_context(job_claimed_execution: @job_claimed_execution)
    add_breadcrumb(text: @job_claimed_execution, path: show_url)
  end

  def job_claimed_execution_params
    admin? ? params.expect(job_claimed_execution: %i[job_id process_id]) : {}
  end
end
