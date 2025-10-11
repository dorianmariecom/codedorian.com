# frozen_string_literal: true

class ReplPromptsController < ApplicationController
  before_action(:load_user)
  before_action(:load_repl_session)
  before_action(:load_repl_program)
  before_action { add_breadcrumb(key: "repl_prompts.index", path: index_url) }
  before_action(:load_repl_prompt, only: %i[show destroy])

  def index
    authorize(ReplPrompt)

    @repl_prompts = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def destroy
    @repl_prompt.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(ReplPrompt)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(ReplPrompt)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  private

  def load_user
    return if params[:user_id].blank?

    @user =
      if params[:user_id] == "me"
        policy_scope(User).find(current_user&.id)
      else
        policy_scope(User).find(params[:user_id])
      end

    set_error_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def load_repl_session
    return if params[:repl_session_id].blank?

    @repl_session = repl_sessions_scope.find(params[:repl_session_id])

    set_error_context(repl_session: @repl_session)
    add_breadcrumb(key: "repl_sessions.index", path: [@user, :repl_sessions])
    add_breadcrumb(text: @repl_session, path: [@user, @repl_session])
  end

  def load_repl_program
    return if params[:repl_program_id].blank?

    @repl_program = repl_programs_scope.find(params[:repl_program_id])

    set_error_context(repl_program: @repl_program)
    add_breadcrumb(
      key: "repl_programs.index",
      path: [@user, @repl_session, :repl_programs]
    )
    add_breadcrumb(
      text: @repl_program,
      path: [@user, @repl_session, @repl_program]
    )
  end

  def scope
    scope = searched_policy_scope(ReplPrompt)
    scope = scope.where(user: @user) if @user
    scope = scope.where(repl_program: @repl_program) if @repl_program

    if @repl_session
      scope =
        scope.joins(:repl_session).where(repl_session: { id: @repl_session.id })
    end

    scope
  end

  def repl_programs_scope
    scope = policy_scope(ReplProgram)
    scope = scope.where(repl_session: @repl_session) if @repl_session
    scope = scope.joins(:user).where(user: { id: @user }) if @user
    scope
  end

  def repl_sessions_scope
    scope = policy_scope(ReplSession)
    scope = scope.where(user: @user) if @user
    scope
  end

  def model_class
    ReplPrompt
  end

  def model_instance
    @repl_prompt
  end

  def nested
    [@user, @program]
  end

  def id
    params[:repl_prompt_id].presence || params[:id]
  end

  def load_repl_prompt
    @repl_prompt = authorize(scope.find(id))
    set_error_context(repl_prompt: @repl_prompt)
    add_breadcrumb(text: @repl_prompt, path: show_url)
  end
end
