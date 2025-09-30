# frozen_string_literal: true

class ProgramPromptSchedulesController < ApplicationController
  before_action(:load_user)
  before_action(:load_program)
  before_action(
    :load_program_prompt_schedule,
    only: %i[show edit update destroy]
  )

  def index
    authorize(ProgramPromptSchedule)

    @program_prompt_schedules =
      scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @program_prompt_schedule = authorize(scope.new(program: @program))
  end

  def edit
  end

  def create
    @program_prompt_schedule =
      authorize(scope.new(program_prompt_schedule_params))

    if @program_prompt_schedule.save
      log_in(@program_prompt_schedule.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @program_prompt_schedule.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    if @program_prompt_schedule.update(program_prompt_schedule_params)
      log_in(@program_prompt_schedule.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @program_prompt_schedule.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @program_prompt_schedule.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(ProgramPromptSchedule)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(ProgramPromptSchedule)

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

    @program = program_scope.find(params[:program_id])
    set_error_context(program: @program)
  end

  def scope
    scope = searched_policy_scope(ProgramPromptSchedule)
    scope = scope.where(program: @program) if @program
    scope = scope.joins(:user).where(user: { id: @user }) if @user
    scope
  end

  def program_scope
    scope = policy_scope(Program)
    scope = scope.where(user: @user) if @user
    scope
  end

  def model_class
    ProgramPromptSchedule
  end

  def model_instance
    @program_prompt_schedule
  end

  def nested
    [@user, @program]
  end

  def id
    params[:program_prompt_schedule_id].presence || params[:id]
  end

  def load_program_prompt_schedule
    @program_prompt_schedule = authorize(scope.find(id))
    set_error_context(program_prompt_schedule: @program_prompt_schedule)
  end

  def program_prompt_schedule_params
    params.expect(program_prompt_schedule: %i[starts_at interval])
  end
end
