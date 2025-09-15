# frozen_string_literal: true

class ReplProgramsController < ApplicationController
  before_action(:load_user)
  before_action(:load_repl_session)
  before_action(:load_repl_program, only: %i[show edit update destroy])

  helper_method(:url)
  helper_method(:new_url)
  helper_method(:prompts_url)
  helper_method(:delete_all_url)
  helper_method(:destroy_all_url)

  def index
    authorize(ReplProgram)

    @repl_programs = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @repl_program = authorize(scope.new(repl_session: @repl_session))
  end

  def edit
  end

  def create
    @repl_program = authorize(scope.new(repl_program_params))

    if @repl_program.save
      log_in(@repl_program.user)

      if generate?
        @prompt = authorize(prompt_scope.new(prompt_params))

        if @prompt.save
          GenerateJob.perform_later(prompt: @prompt)
        else
          flash.now.alert = @prompt.alert
        end

        redirect_back_or_to([:edit, @repl_program], notice: t(".notice"))
      else
        EvaluateJob.perform_later(program: @repl_program)
        redirect_back_or_to(@repl_program, notice: t(".notice"))
      end
    else
      flash.now.alert = @repl_program.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    if @repl_program.update(repl_program_params)
      log_in(@repl_program.user)

      if generate?
        @prompt = authorize(prompt_scope.new(prompt_params))

        if @prompt.save
          GenerateJob.perform_later(prompt: @prompt)
        else
          flash.now.alert = @prompt.alert
        end

        head :no_content
      else
        EvaluateJob.perform_later(program: @repl_program)
        redirect_back_or_to(@repl_program, notice: t(".notice"))
      end
    else
      flash.now.alert = @repl_program.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @repl_program.destroy!

    redirect_to(url, notice: t(".notice"))
  end

  def destroy_all
    authorize(ReplProgram)

    scope.destroy_all

    redirect_back_or_to(url)
  end

  def delete_all
    authorize(ReplProgram)

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

  def scope
    scope = searched_policy_scope(ReplProgram)
    scope = scope.where(repl_session: @repl_session) if @repl_session
    if @user
      scope = scope.joins(:repl_session).where(repl_session: { user: @user })
    end
    scope
  end

  def delete_all_url
    [
      :delete_all,
      @user,
      @repl_session,
      :repl_programs,
      { search: { q: q } }
    ].compact
  end

  def destroy_all_url
    [
      :destroy_all,
      @user,
      @repl_session,
      :repl_programs,
      { search: { q: q } }
    ].compact
  end

  def url
    [@user, @repl_session, :repl_programs].compact
  end

  def new_url
    [:new, @user, @repl_session, :repl_program].compact
  end

  def prompts_url
    [
      @user,
      @repl_session,
      @repl_program.persisted? ? @repl_program : nil,
      :prompts
    ].compact
  end

  def id
    params[:repl_program_id].presence || params[:id]
  end

  def generate?
    params.dig(:program, :generate).present?
  end

  def load_repl_program
    @repl_program = authorize(scope.find(id))
  end

  def repl_program_params
    params.expect(repl_program: %i[repl_session_id input])
  end
end
