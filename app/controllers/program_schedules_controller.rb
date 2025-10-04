# frozen_string_literal: true

class ProgramSchedulesController < ApplicationController
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_program_schedule, only: %i[show edit update destroy])

  def index
    authorize(ProgramSchedule)

    @program_schedules = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @program_schedule = authorize(scope.new(program: @program))
  end

  def edit
  end

  def create
    @program_schedule = authorize(scope.new(program_schedule_params))

    if @program_schedule.save
      log_in(@program_schedule.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @program_schedule.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    if @program_schedule.update(program_schedule_params)
      log_in(@program_schedule.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @program_schedule.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @program_schedule.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(ProgramSchedule)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(ProgramSchedule)

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
    scope = searched_policy_scope(ProgramSchedule)
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
    ProgramSchedule
  end

  def model_instance
    @program_schedule
  end

  def nested
    [@user, @program]
  end

  def id
    params[:program_schedule_id].presence || params[:id]
  end

  def load_program_schedule
    @program_schedule = authorize(scope.find(id))
    set_error_context(program_schedule: @program_schedule)
  end

  def program_schedule_params
    params.expect(program_schedule: %i[starts_at interval])
  end
end
