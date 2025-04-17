# frozen_string_literal: true

class ReplProgramsController < ApplicationController
  before_action :load_user
  before_action :load_repl_session
  before_action :load_repl_program, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url

  def index
    authorize ReplProgram

    @repl_programs = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @repl_program = authorize scope.new(repl_session: @repl_session)
  end

  def edit
  end

  def create
    @repl_program = authorize scope.new(repl_program_params)

    if @repl_program.save
      log_in(@repl_program.user)
      @repl_program.evaluate!
      redirect_back_or_to @repl_program, notice: t(".notice")
    else
      flash.now.alert = @repl_program.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @repl_program.update(repl_program_params)
      log_in(@repl_program.user)
      @repl_program.evaluate!
      redirect_back_or_to @repl_program, notice: t(".notice")
    else
      flash.now.alert = @repl_program.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @repl_program.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize ReplProgram

    scope.destroy_all

    redirect_back_or_to(repl_programs_path)
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

  def scope
    if @user && @repl_session
      policy_scope(ReplProgram).joins(:repl_session).where(
        repl_session: {
          id: @repl_session,
          user_id: @user.id
        }
      )
    elsif @user
      policy_scope(ReplProgram).joins(:repl_session).where(
        repl_session: {
          user_id: @user.id
        }
      )
    elsif @repl_session
      policy_scope(ReplProgram).where(repl_session: @repl_session)
    else
      policy_scope(ReplProgram)
    end
  end

  def url
    [@user, @repl_session, :repl_programs].compact
  end

  def new_url
    [:new, @user, @repl_session, :repl_program].compact
  end

  def id
    params[:repl_program_id].presence || params[:id]
  end

  def load_repl_program
    @repl_program = authorize scope.find(id)
  end

  def repl_program_params
    params.expect(repl_program: %i[repl_session_id input])
  end
end
