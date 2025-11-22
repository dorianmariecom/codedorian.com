# frozen_string_literal: true

class ProgramSchedulesController < ApplicationController
  before_action(:load_user)
  before_action(:load_program)
  before_action do
    add_breadcrumb(key: "program_schedules.index", path: index_url)
  end
  before_action(:load_program_schedule, only: %i[show edit update destroy])

  def index
    authorize(ProgramSchedule)

    @program_schedules = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @program_schedule = authorize(scope.new(program: @program))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @program_schedule = authorize(scope.new(program_schedule_params))

    if @program_schedule.save
      log_in(@program_schedule.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @program_schedule.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    if @program_schedule.update(program_schedule_params)
      log_in(@program_schedule.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @program_schedule.alert
      render(:edit, status: :unprocessable_content)
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
    return if params[:user_id].blank?

    @user =
      if params[:user_id] == "me"
        policy_scope(User).find(current_user&.id)
      else
        policy_scope(User).find(params[:user_id])
      end

    set_error_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def load_program
    return if params[:program_id].blank?

    @program = programs_scope.find(params[:program_id])

    set_error_context(program: @program)
    add_breadcrumb(key: "programs.index", path: [@user, :programs])
    add_breadcrumb(text: @program, path: [@user, @program])
  end

  def scope
    scope = searched_policy_scope(ProgramSchedule)
    scope = scope.where_program(@program) if @program
    scope = scope.where_user(@user) if @user
    scope
  end

  def programs_scope
    scope = policy_scope(Program)
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    ProgramSchedule
  end

  def model_instance
    @program_schedule
  end

  def nested(user: @user, program: @program)
    [user, program]
  end

  def filters
    %i[user program]
  end

  def id
    params[:program_schedule_id].presence || params[:id]
  end

  def load_program_schedule
    @program_schedule = authorize(scope.find(id))
    set_error_context(program_schedule: @program_schedule)
    add_breadcrumb(text: @program_schedule, path: show_url)
  end

  def program_schedule_params
    params.expect(program_schedule: %i[starts_at interval])
  end
end
