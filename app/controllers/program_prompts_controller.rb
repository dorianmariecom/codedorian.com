# frozen_string_literal: true

class ProgramPromptsController < ApplicationController
  before_action(:load_user)
  before_action(:load_program)
  before_action do
    add_breadcrumb(key: "program_prompts.index", path: index_url)
  end
  before_action(:load_program_prompt, only: %i[show destroy])

  def index
    authorize(ProgramPrompt)

    @program_prompts = scope.page(params[:page]).order(created_at: :desc)
    @program_prompt_schedules = program_prompt_schedules_scope
  end

  def show
    @program_prompt_schedules =
      program_prompt_schedules_scope.order(created_at: :asc).page(params[:page])
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
    return if params[:user_id].blank?
    return if params[:user_id] == "me" && current_user.nil?

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

  def load_program
    return if params[:program_id].blank?

    @program = programs_scope.find(params[:program_id])

    set_context(program: @program)
    add_breadcrumb(key: "programs.index", path: [@user, :programs])
    add_breadcrumb(text: @program, path: [@user, @program])
  end

  def scope
    scope = searched_policy_scope(ProgramPrompt)
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope
  end

  def programs_scope
    scope = policy_scope(Program)
    scope = scope.where_user(@user) if @user
    scope
  end

  def program_prompt_schedules_scope
    scope = policy_scope(ProgramPromptSchedule)
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope
  end

  def model_class
    ProgramPrompt
  end

  def model_instance
    @program_prompt
  end

  def nested(user: @user, program: @program)
    [user, program]
  end

  def filters
    %i[user program]
  end

  def id
    params[:program_prompt_id].presence || params[:id]
  end

  def load_program_prompt
    @program_prompt = authorize(scope.find(id))
    set_context(program_prompt: @program_prompt)
    add_breadcrumb(text: @program_prompt, path: show_url)
  end
end
