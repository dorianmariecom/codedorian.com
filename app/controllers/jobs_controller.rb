# frozen_string_literal: true

class JobsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_program_prompt)
  before_action { add_breadcrumb(key: "jobs.index", path: index_url) }
  before_action(
    :load_job,
    only: %i[show edit update destroy delete discard retry]
  )

  def index
    authorize(Job)

    @jobs = scope.page(params[:page]).order(created_at: :desc)
    @job_contexts = job_contexts_scope
    @job_processes = job_processes_scope
    @job_pauses = job_pauses_scope
    @job_semaphores = job_semaphores_scope
    @job_ready_executions = job_ready_executions_scope
    @job_failed_executions = job_failed_executions_scope
    @job_scheduled_executions = job_scheduled_executions_scope
    @job_blocked_executions = job_blocked_executions_scope
    @job_claimed_executions = job_claimed_executions_scope
    @job_recurring_executions = job_recurring_executions_scope
    @job_recurring_tasks = job_recurring_tasks_scope
  end

  def show
    @job_contexts =
      job_contexts_scope.order(created_at: :desc).page(params[:page])
    @job_ready_executions =
      job_ready_executions_scope.order(created_at: :desc).page(params[:page])
    @job_failed_executions =
      job_failed_executions_scope.order(created_at: :desc).page(params[:page])
    @job_scheduled_executions =
      job_scheduled_executions_scope.order(created_at: :desc).page(
        params[:page]
      )
    @job_blocked_executions =
      job_blocked_executions_scope.order(created_at: :desc).page(params[:page])
    @job_claimed_executions =
      job_claimed_executions_scope.order(created_at: :desc).page(params[:page])
    @job_recurring_executions =
      job_recurring_executions_scope.order(created_at: :desc).page(
        params[:page]
      )
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @job = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @job = authorize(scope.new(job_params))

    if @job.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @job.assign_attributes(job_params)

    if @job.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def retry
    @job.retry!

    redirect_to(index_url, notice: t(".notice"))
  end

  def discard
    @job.discard!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @job.delete

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy
    @job.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def retry_all
    authorize(Job)

    scope.retry_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def discard_all
    authorize(Job)

    scope.discard_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Job)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Job)

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

  def load_program_prompt
    return if params[:program_prompt_id].blank?

    @program_prompt = program_prompts_scope.find(params[:program_prompt_id])

    set_context(program_prompt: @program_prompt)
    add_breadcrumb(
      key: "program_prompts.index",
      path: [@user, :program_prompts]
    )
    add_breadcrumb(
      text: @program_prompt,
      path: [@user, @program, @program_prompt]
    )
  end

  def load_job
    @job = authorize(scope.find(id))

    set_context(job: @job)
    add_breadcrumb(text: @job, path: show_url)
  end

  def id
    params[:job_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(Job)

    if @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
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

  def program_prompts_scope
    scope = policy_scope(ProgramPrompt)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program

    scope
  end

  def job_contexts_scope
    scope = policy_scope(JobContext)

    if @job
      scope = scope.where_job(@job)
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_processes_scope
    policy_scope(JobProcess)
  end

  def job_pauses_scope
    policy_scope(JobPause)
  end

  def job_semaphores_scope
    policy_scope(JobSemaphore)
  end

  def job_ready_executions_scope
    scope = policy_scope(JobReadyExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_failed_executions_scope
    scope = policy_scope(JobFailedExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_scheduled_executions_scope
    scope = policy_scope(JobScheduledExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_blocked_executions_scope
    scope = policy_scope(JobBlockedExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_claimed_executions_scope
    scope = policy_scope(JobClaimedExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_recurring_executions_scope
    scope = policy_scope(JobRecurringExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_recurring_tasks_scope
    policy_scope(JobRecurringTask)
  end

  def logs_scope
    scope = policy_scope(Log)

    scope = scope.where_job(@job) if @job

    scope
  end

  def model_class
    Job
  end

  def model_instance
    @job
  end

  def nested(
    user: @user,
    guest: @guest,
    program: @program,
    program_prompt: @program_prompt
  )
    [user || guest, program, program_prompt].compact
  end

  def filters
    %i[user program program_prompt]
  end

  def job_params
    if admin?
      params.expect(
        job: %i[
          active_job_id
          arguments
          class_name
          concurrency_key
          finished_at
          priority
          queue_name
          scheduled_at
        ]
      )
    else
      {}
    end
  end
end
