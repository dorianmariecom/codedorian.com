# frozen_string_literal: true

class ReplSessionsController < ApplicationController
  before_action(:load_user)
  before_action { add_breadcrumb(key: "repl_sessions.index", path: index_url) }
  before_action(:load_repl_session, only: %i[show edit update destroy evaluate])

  def index
    authorize(ReplSession)

    @repl_sessions = scope.page(params[:page]).order(created_at: :asc)
    @repl_programs = repl_programs_scope
    @repl_executions = repl_executions_scope
    @repl_prompts = repl_prompts_scope
  end

  def evaluate
    perform_later(
      ReplSessionEvaluateJob,
      arguments: {
        repl_session: @repl_session
      },
      context: {
        current_user: current_user,
        user: @user,
        repl_session: @repl_session
      }
    )

    redirect_back_or_to(show_url)
  end

  def show
    @repl_programs =
      repl_programs_scope.order(created_at: :asc).page(params[:page])

    @repl_program = @repl_programs.new

    @repl_executions =
      repl_executions_scope.order(created_at: :desc).page(params[:page])

    @repl_prompts =
      repl_prompts_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @repl_session = authorize(scope.new(user: @user))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @repl_session = authorize(scope.new(repl_session_params))

    if @repl_session.save
      log_in(@repl_session.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @repl_session.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    if @repl_session.update(repl_session_params)
      log_in(@repl_session.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @repl_session.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @repl_session.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(ReplSession)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(ReplSession)

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

  def scope
    scope = searched_policy_scope(ReplSession)
    scope = scope.where(user: @user) if @user
    scope
  end

  def repl_programs_scope
    scope = searched_policy_scope(ReplProgram)
    scope = scope.joins(:user).where(user: { id: @user }) if @user
    scope = scope.where(repl_session: @repl_session) if @repl_session
    scope
  end

  def repl_prompts_scope
    scope = searched_policy_scope(ReplPrompt)
    scope = scope.joins(:user).where(user: { id: @user }) if @user
    scope = scope.where(repl_session: @repl_session) if @repl_session
    scope
  end

  def repl_executions_scope
    scope = searched_policy_scope(ReplExecution)
    scope = scope.joins(:user).where(user: { id: @user }) if @user
    scope =
      scope.joins(:repl_session).where(
        repl_session: {
          id: @repl_session
        }
      ) if @repl_session
    scope
  end

  def model_class
    ReplSession
  end

  def model_instance
    @repl_session
  end

  def nested
    [@user]
  end

  def id
    params[:repl_session_id].presence || params[:id]
  end

  def load_repl_session
    @repl_session = authorize(scope.find(id))
    set_error_context(repl_session: @repl_session)
    add_breadcrumb(text: @repl_session, path: show_url)
  end

  def repl_session_params
    if admin?
      params.expect(repl_session: %i[user_id name])
    else
      params.expect(repl_session: [:name])
    end
  end
end
