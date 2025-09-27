# frozen_string_literal: true

class ReplProgramsController < ApplicationController
  before_action(:load_user)
  before_action(:load_repl_session)
  before_action(:load_repl_program, only: %i[show edit update destroy])

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
        @user = @repl_program.user
        @repl_prompt = authorize(repl_prompts_scope.new(repl_prompt_params))

        if @repl_prompt.save
          ReplPromptGenerateJob.perform_later(repl_prompt: @repl_prompt)
        else
          flash.now.alert = @repl_prompt.alert
        end

        redirect_back_or_to(edit_url, notice: t(".notice"))
      else
        ReplProgramEvaluateJob.perform_later(repl_program: @repl_program)
        redirect_back_or_to(show_url, notice: t(".notice"))
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
        @user = @repl_program.user
        @repl_prompt = authorize(repl_prompts_scope.new(repl_prompt_params))

        if @repl_prompt.save
          ReplPromptGenerateJob.perform_later(repl_prompt: @repl_prompt)
        else
          flash.now.alert = @repl_prompt.alert
        end

        head :no_content
      else
        ReplProgramEvaluateJob.perform_later(repl_program: @repl_program)
        redirect_back_or_to(show_url, notice: t(".notice"))
      end
    else
      flash.now.alert = @repl_program.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @repl_program.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(ReplProgram)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(ReplProgram)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  private

  def load_user
    if params[:user_id] == "me"
      @user = policy_scope(User).find(current_user&.id)
      set_error_context(user: @user)
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
      set_error_context(user: @user)
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

    set_error_context(repl_session: @repl_session)
  end

  def scope
    scope = searched_policy_scope(ReplProgram)
    if @user
      scope = scope.joins(:repl_session).where(repl_session: { user: @user })
    end
    scope = scope.where(repl_session: @repl_session) if @repl_session
    scope
  end

  def repl_prompts_scope
    scope = policy_scope(ReplPrompt)
    scope = scope.where(user: @user) if @user
    scope = scope.where(repl_program: @repl_program) if @repl_program
    scope
  end

  def model_class
    ReplProgram
  end

  def model_instance
    @repl_program
  end

  def nested
    [@user, @repl_session]
  end

  def id
    params[:repl_program_id].presence || params[:id]
  end

  def generate?
    params.dig(:repl_program, :generate).present?
  end

  def load_repl_program
    @repl_program = authorize(scope.find(id))
    set_error_context(repl_program: @repl_program)
  end

  def repl_program_params
    if admin?
      params.expect(repl_program: %i[repl_session_id input])
    else
      params.expect(repl_program: %i[input])
    end
  end

  def repl_prompt_params
    params.expect(repl_program: %i[input])
  end
end
