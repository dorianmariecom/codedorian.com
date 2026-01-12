# frozen_string_literal: true

class ProgramPromptsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action do
    add_breadcrumb(key: "program_prompts.index", path: index_url)
  end
  before_action(:load_program_prompt, only: %i[show edit update destroy delete])

  def index
    authorize(ProgramPrompt)

    @program_prompts = scope.page(params[:page]).order(created_at: :desc)
    @program_prompt_schedules = program_prompt_schedules_scope
  end

  def show
    @program_prompt_schedules =
      program_prompt_schedules_scope.order(created_at: :asc).page(params[:page])
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @program_prompt = authorize(scope.new(program: @program))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @program_prompt = authorize(scope.new(program_prompt_params))

    if @program_prompt.save(context: :controller)
      log_in(@program_prompt.user)
      @user = @program_prompt.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @program_prompt.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @program_prompt.assign_attributes(program_prompt_params)

    if @program_prompt.save(context: :controller)
      log_in(@program_prompt.user)
      @user = @program_prompt.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @program_prompt.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @program_prompt.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @program_prompt.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(ProgramPrompt)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(ProgramPrompt)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        policy_scope(Guest).find(current_guest&.id)
      else
        policy_scope(Guest).find(params[:guest_id])
      end

    set_context(guest: @guest)
    add_breadcrumb(key: "guests.index", path: :guests)
    add_breadcrumb(text: @guest, path: @guest)
  end

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

  def load_program
    return if params[:program_id].blank?

    @program = programs_scope.find(params[:program_id])

    set_context(program: @program)
    add_breadcrumb(key: "programs.index", path: [@user, :programs])
    add_breadcrumb(text: @program, path: [@user, @program])
  end

  def scope
    scope = searched_policy_scope(ProgramPrompt)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope
  end

  def programs_scope
    scope = policy_scope(Program)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def program_prompt_schedules_scope
    scope = policy_scope(ProgramPromptSchedule)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_program_prompt(@program_prompt) if @program_prompt
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_program_prompt(@program_prompt) if @program_prompt
    scope
  end

  def model_class
    ProgramPrompt
  end

  def model_instance
    @program_prompt
  end

  def nested(user: @user, guest: @guest, program: @program)
    [user || guest, program]
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

  def program_prompt_params
    if admin?
      params.expect(
        program_prompt: [
          :program_id,
          :user_id,
          :name,
          :input,
          :status,
          {
            program_prompt_schedules_attributes: %i[
              id
              _destroy
              starts_at
              interval
            ]
          }
        ]
      )
    else
      params.expect(
        program_prompt: [
          :name,
          :input,
          {
            program_prompt_schedules_attributes: %i[
              id
              _destroy
              starts_at
              interval
            ]
          }
        ]
      )
    end
  end
end
