# frozen_string_literal: true

class ReplPromptsController < ApplicationController
  before_action(:load_user)
  before_action(:load_repl_session)
  before_action(:load_repl_program)
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
    if params[:user_id] == "me"
      @user = policy_scope(User).find(current_user&.id)
      set_error_context(user: @user)
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
      set_error_context(user: @user)
    end
  end

  def load_repl_program
    return if params[:repl_program_id].blank?

    @repl_program = policy_scope(ReplProgram).find(params[:repl_program_id])
  end

  def load_repl_session
    return if params[:repl_session_id].blank?

    @repl_session = policy_scope(ReplSession).find(params[:repl_session_id])
  end

  def scope
    scope = searched_policy_scope(ReplPrompt)
    scope = scope.where(user: @user) if @user
    scope = scope.where(repl_program: @repl_program) if @repl_program
    scope = scope.joins(:repl_session).where(repl_session: { id: @repl_session.id }) if @repl_session
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
  end
end
