# frozen_string_literal: true

class JobsController < ApplicationController
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_program_prompt)
  before_action(:load_repl_session)
  before_action(:load_repl_program)
  before_action(:load_repl_prompt)
  before_action { add_breadcrumb(key: "jobs.index", path: index_url) }
  before_action(:load_job, only: %i[show destroy delete discard retry])

  def index
    authorize(Job)

    @jobs = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
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
    @job.delete!

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

  def load_user
    return if params[:user_id].blank?
    return if params[:user_id] == "me" && current_user.nil?

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
    @job = authorize(scope.find(id))

    set_context(job: @job)
    add_breadcrumb(text: @job, path: show_url)
  end

  def id
    params[:job_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(Job)
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope = scope.where_program_prompt(@program_prompt) if @program_prompt
    scope = scope.where_repl_session(@repl_session) if @repl_session
    scope = scope.where_repl_program(@repl_program) if @repl_program
    scope = scope.where_repl_prompt(@repl_prompt) if @repl_prompt
    scope
  end

  def programs_scope
    scope = policy_scope(Program)
    scope = scope.where_user(@user) if @user
    scope
  end

  def program_prompts_scope
    scope = policy_scope(ProgramPrompt)
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope
  end

  def repl_sessions_scope
    scope = policy_scope(ReplSession)
    scope = scope.where_user(@user) if @user
    scope
  end

  def repl_programs_scope
    scope = policy_scope(ReplProgram)
    scope = scope.where_user(@user) if @user
    scope = scope.where_repl_session(@repl_session) if @repl_session
    scope
  end

  def repl_prompts_scope
    scope = policy_scope(ReplPrompt)
    scope = scope.where_user(@user) if @user
    scope = scope.where_repl_session(@repl_session) if @repl_session
    scope = scope.where_repl_program(@repl_program) if @repl_program
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
    program: @program,
    program_prompt: @program_prompt,
    repl_session: @repl_session,
    repl_program: @repl_program,
    repl_prompt: @repl_prompt
  )
    if program || program_prompt
      [user, program, program_prompt]
    else
      [user, repl_session, repl_program, repl_prompt]
    end
  end

  def filters
    %i[user program program_prompt repl_session repl_program repl_prompt]
  end
end
