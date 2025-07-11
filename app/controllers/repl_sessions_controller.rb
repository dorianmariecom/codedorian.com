# frozen_string_literal: true

class ReplSessionsController < ApplicationController
  before_action :load_user
  before_action :load_repl_session, only: %i[show edit update destroy evaluate]

  helper_method :url
  helper_method :new_url
  helper_method :prompts_url
  helper_method :delete_all_url
  helper_method :destroy_all_url

  def index
    authorize ReplSession

    @repl_sessions = scope.page(params[:page]).order(created_at: :asc)
  end

  def evaluate
    @repl_session.evaluate!

    redirect_back_or_to(@repl_session)
  end

  def show
    @repl_programs =
      policy_scope(ReplProgram)
        .where(repl_session: @repl_session)
        .order(created_at: :asc)
        .page(params[:page])

    @repl_program = @repl_programs.new

    @repl_executions =
      policy_scope(ReplExecution)
        .joins(:repl_session)
        .where(repl_session: { id: @repl_session })
        .order(created_at: :desc)
        .page(params[:page])
  end

  def new
    @repl_session = authorize scope.new(user: @user)
  end

  def edit
  end

  def create
    @repl_session = authorize scope.new(repl_session_params)

    if @repl_session.save
      log_in(@repl_session.user)
      redirect_to @repl_session, notice: t(".notice")
    else
      flash.now.alert = @repl_session.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @repl_session.update(repl_session_params)
      log_in(@repl_session.user)
      redirect_to @repl_session, notice: t(".notice")
    else
      flash.now.alert = @repl_session.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @repl_session.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize ReplSession

    scope.destroy_all

    redirect_back_or_to(url)
  end

  def delete_all
    authorize ReplSession

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

  def scope
    scope = searched_policy_scope(ReplSession)
    scope = scope.where(user: @user) if @user
    scope
  end

  def delete_all_url
    [:delete_all, @user, :repl_sessions, { search: { q: q } }].compact
  end

  def destroy_all_url
    [:destroy_all, @user, :repl_sessions, { search: { q: q } }].compact
  end

  def url
    @user ? [@user, :repl_sessions] : repl_sessions_path
  end

  def new_url
    @user ? [:new, @user, :repl_session] : new_repl_session_path
  end

  def prompts_url
    [@user, @repl_session, :prompts].compact
  end

  def id
    params[:repl_session_id].presence || params[:id]
  end

  def load_repl_session
    @repl_session = authorize scope.find(id)
  end

  def repl_session_params
    if admin?
      params.expect(
        repl_session: [
          :user_id,
          :name,
          { repl_programs_attributes: [%i[id _destroy input]] }
        ]
      )
    else
      params.expect(
        repl_session: [
          :name,
          { repl_programs_attributes: [%i[id _destroy input]] }
        ]
      )
    end
  end
end
