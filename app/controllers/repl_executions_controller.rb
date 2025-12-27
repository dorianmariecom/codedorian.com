# frozen_string_literal: true

class ReplExecutionsController < ApplicationController
  before_action(:load_user)
  before_action(:load_repl_session)
  before_action(:load_repl_program)
  before_action do
    add_breadcrumb(key: "repl_executions.index", path: index_url)
  end
  before_action(:load_repl_execution, only: %i[show destroy])

  def index
    authorize(ReplExecution)

    @repl_executions = scope.page(params[:page]).order(created_at: :asc).to_a
  end

  def show
  end

  def destroy
    @repl_execution.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(ReplExecution)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(ReplExecution)

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

    set_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
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
    scope = searched_policy_scope(ReplExecution)

    scope = scope.where_repl_program(@repl_program) if @repl_program

    scope = scope.where_repl_session(@repl_session) if @repl_session

    scope = scope.where_user(@user) if @user

    scope
  end

  def repl_programs_scope
    scope = policy_scope(ReplProgram)
    scope = scope.where_repl_session(@repl_session) if @repl_session
    scope = scope.where_user(@user) if @user
    scope
  end

  def repl_sessions_scope
    scope = policy_scope(ReplSession)
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    ReplExecution
  end

  def model_instance
    @repl_execution
  end

  def nested(
    user: @user,
    repl_session: @repl_session,
    repl_program: @repl_program
  )
    [user, repl_session, repl_program]
  end

  def filters
    %i[user repl_session repl_program]
  end

  def id
    params[:repl_execution_id].presence || params[:id]
  end

  def load_repl_execution
    @repl_execution = authorize(scope.find(id))
    set_context(repl_execution: @repl_execution)
    add_breadcrumb(text: @repl_execution, path: show_url)
  end
end
