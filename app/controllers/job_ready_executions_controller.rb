# frozen_string_literal: true

class JobReadyExecutionsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_program_prompt)
  before_action(:load_repl_session)
  before_action(:load_repl_program)
  before_action(:load_repl_prompt)
  before_action(:load_job)
  before_action do
    add_breadcrumb(key: "job_ready_executions.index", path: index_url)
  end
  before_action(
    :load_job_ready_execution,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(JobReadyExecution)

    @job_ready_executions = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def new
    @job_ready_execution = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @job_ready_execution = authorize(scope.new(job_ready_execution_params))

    if @job_ready_execution.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job_ready_execution.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @job_ready_execution.assign_attributes(job_ready_execution_params)

    if @job_ready_execution.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job_ready_execution.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @job_ready_execution.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @job_ready_execution.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(JobReadyExecution)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(JobReadyExecution)

    scope.delete_all

    redirect_back_or_to(index_url)
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

  def load_repl_session
    return if params[:repl_session_id].blank?

    @repl_session = repl_sessions_scope.find(params[:repl_session_id])

    set_context(repl_session: @repl_session)
    add_breadcrumb(key: "repl_sessions.index", path: [@user, :repl_sessions])
    add_breadcrumb(text: @repl_session, path: [@user, @repl_session])
  end

  def load_repl_program
    return if params[:repl_program_id].blank?

    @repl_program = repl_programs_scope.find(params[:repl_program_id])

    set_context(repl_program: @repl_program)
    add_breadcrumb(key: "repl_programs.index", path: [@user, :repl_programs])
    add_breadcrumb(
      text: @repl_program,
      path: [@user, @repl_session, @repl_program]
    )
  end

  def load_repl_prompt
    return if params[:repl_prompt_id].blank?

    @repl_prompt = repl_prompts_scope.find(params[:repl_prompt_id])

    set_context(repl_prompt: @repl_prompt)
    add_breadcrumb(key: "repl_prompts.index", path: [@user, :repl_prompts])
    add_breadcrumb(
      text: @repl_prompt,
      path: [@user, @repl_session, @repl_program, @repl_prompt]
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
    params[:job_ready_execution_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(JobReadyExecution)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope = scope.where_program_prompt(@program_prompt) if @program_prompt
    scope = scope.where_repl_session(@repl_session) if @repl_session
    scope = scope.where_repl_program(@repl_program) if @repl_program
    scope = scope.where_repl_prompt(@repl_prompt) if @repl_prompt
    scope = scope.where_job(@job) if @job
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

  def repl_sessions_scope
    scope = policy_scope(ReplSession)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def repl_programs_scope
    scope = policy_scope(ReplProgram)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_repl_session(@repl_session) if @repl_session
    scope
  end

  def repl_prompts_scope
    scope = policy_scope(ReplPrompt)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_repl_session(@repl_session) if @repl_session
    scope = scope.where_repl_program(@repl_program) if @repl_program
    scope
  end

  def jobs_scope
    scope = policy_scope(Job)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope = scope.where_program_prompt(@program_prompt) if @program_prompt
    scope = scope.where_repl_session(@repl_session) if @repl_session
    scope = scope.where_repl_program(@repl_program) if @repl_program
    scope = scope.where_repl_prompt(@repl_prompt) if @repl_prompt
    scope
  end

  def model_class
    JobReadyExecution
  end

  def model_instance
    @job_ready_execution
  end

  def nested(
    user: @user,
    guest: @guest,
    program: @program,
    program_prompt: @program_prompt,
    repl_session: @repl_session,
    repl_program: @repl_program,
    repl_prompt: @repl_prompt,
    job: @job
  )
    if program || program_prompt
      [user || guest, program, program_prompt, job].compact
    else
      [user || guest, repl_session, repl_program, repl_prompt, job].compact
    end
  end

  def filters
    %i[user program program_prompt repl_session repl_program repl_prompt job]
  end

  def load_job_ready_execution
    @job_ready_execution = authorize(scope.find(id))
    set_context(job_ready_execution: @job_ready_execution)
    add_breadcrumb(text: @job_ready_execution, path: show_url)
  end

  def job_ready_execution_params
    if admin?
      params.expect(job_ready_execution: %i[job_id queue_name priority])
    else
      {}
    end
  end
end
