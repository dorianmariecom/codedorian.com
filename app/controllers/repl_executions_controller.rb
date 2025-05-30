# frozen_string_literal: true

class ReplExecutionsController < ApplicationController
  before_action :load_user
  before_action :load_repl_session
  before_action :load_repl_program
  before_action :load_repl_execution, only: %i[show destroy]

  helper_method :url
  helper_method :new_url
  helper_method :delete_all_url
  helper_method :destroy_all_url

  def index
    authorize ReplExecution

    @repl_executions = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def destroy
    @repl_execution.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize ReplExecution

    scope.destroy_all

    redirect_back_or_to(url)
  end

  def delete_all
    authorize ReplExecution

    scope.delete_all

    redirect_back_or_to(url)
  end

  private

  def load_user
    if params[:user_id] == "me"
      @user = policy_scope(User).find(current_user&.id)
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def load_repl_session
    return if params[:repl_session_id].blank?

    @repl_session =
      if @user
        policy_scope(ReplSession).where(user: @user).find(
          params[:repl_session_id]
        )
      else
        policy_scope(ReplSession).find(params[:repl_session_id])
      end
  end

  def load_repl_program
    return if params[:repl_program_id].blank?

    @repl_program =
      if @user
        policy_scope(ReplProgram).where(user: @user).find(
          params[:repl_program_id]
        )
      else
        policy_scope(ReplProgram).find(params[:repl_program_id])
      end
  end

  def scope
    scope = searched_policy_scope(ReplExecution)

    scope = scope.where(repl_program: @repl_program) if @repl_program

    if @repl_session
      scope =
        scope.joins(:repl_program).where(
          repl_program: {
            repl_session: @repl_session
          }
        )
    end

    if @user
      scope = scope.joins(:repl_session).where(repl_session: { user_id: @user })
    end

    scope
  end

  def delete_all_url
    [
      :delete_all,
      @user,
      @repl_session,
      @repl_program,
      :repl_executions,
      { search: { q: q } }
    ].compact
  end

  def destroy_all_url
    [
      :destroy_all,
      @user,
      @repl_session,
      @repl_program,
      :repl_executions,
      { search: { q: q } }
    ].compact
  end

  def url
    [@user, @repl_session, @repl_program, :repl_executions].compact
  end

  def new_url
    [:new, @user, @repl_session, @repl_program, :repl_execution].compact
  end

  def id
    params[:repl_execution_id].presence || params[:id]
  end

  def load_repl_execution
    @repl_execution = authorize scope.find(id)
  end
end
