# frozen_string_literal: true

class ProgramPromptsController < ApplicationController
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_program_prompt, only: %i[show destroy])

  def index
    authorize(ProgramPrompt)

    @program_prompts = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @program_prompt_schedules =
      policy_scope(ProgramPromptSchedule)
        .where(program_prompt: @program_prompt)
        .order(created_at: :asc)
        .page(params[:page])
  end

  def destroy
    @program_prompt.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(ProgramPrompt)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(ProgramPrompt)

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

  def load_program
    return if params[:program_id].blank?

    @program = programs_scope.find(params[:program_id])

    set_error_context(program: @program)
  end

  def scope
    scope = searched_policy_scope(ProgramPrompt)
    scope = scope.where(user: @user) if @user
    scope = scope.where(program: @program) if @program
    scope
  end

  def programs_scope
    scope = policy_scope(Program)
    scope = scope.where(user: @user) if @user
    scope
  end

  def model_class
    ProgramPrompt
  end

  def model_instance
    @program_prompt
  end

  def nested
    [@user, @program]
  end

  def id
    params[:program_prompt_id].presence || params[:id]
  end

  def load_program_prompt
    @program_prompt = authorize(scope.find(id))
    set_error_context(program_prompt: @program_prompt)
  end
end
