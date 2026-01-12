# frozen_string_literal: true

class JobBlockedExecutionsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_program_prompt)
  before_action(:load_job)
  before_action do
    add_breadcrumb(key: "job_blocked_executions.index", path: index_url)
  end
  before_action(
    :load_job_blocked_execution,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(JobBlockedExecution)

    @job_blocked_executions = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @job_blocked_execution = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @job_blocked_execution = authorize(scope.new(job_blocked_execution_params))

    if @job_blocked_execution.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job_blocked_execution.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @job_blocked_execution.assign_attributes(job_blocked_execution_params)

    if @job_blocked_execution.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job_blocked_execution.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @job_blocked_execution.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @job_blocked_execution.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(JobBlockedExecution)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(JobBlockedExecution)

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
    return if params[:job_id].blank?

    @job = jobs_scope.find(params[:job_id])

    set_context(job: @job)
    add_breadcrumb(key: "jobs.index", path: [@user, :jobs])
    add_breadcrumb(text: @job, path: [@user, @job])
  end

  def id
    params[:job_blocked_execution_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(JobBlockedExecution)

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

  def jobs_scope
    scope = policy_scope(Job)

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

  def logs_scope
    scope = policy_scope(Log)

    if @job_blocked_execution
      scope = scope.where_job_blocked_execution(@job_blocked_execution)
    end

    scope
  end

  def model_class
    JobBlockedExecution
  end

  def model_instance
    @job_blocked_execution
  end

  def nested(
    user: @user,
    guest: @guest,
    program: @program,
    program_prompt: @program_prompt,
    job: @job
  )
    [user || guest, program, program_prompt, job].compact
  end

  def filters
    %i[user program program_prompt job]
  end

  def load_job_blocked_execution
    @job_blocked_execution = authorize(scope.find(id))
    set_context(job_blocked_execution: @job_blocked_execution)
    add_breadcrumb(text: @job_blocked_execution, path: show_url)
  end

  def job_blocked_execution_params
    if admin?
      params.expect(
        job_blocked_execution: %i[
          job_id
          queue_name
          concurrency_key
          priority
          expires_at
        ]
      )
    else
      {}
    end
  end
end
