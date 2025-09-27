# frozen_string_literal: true

class SchedulesController < ApplicationController
  before_action(:load_user)
  before_action(:load_schedulable)
  before_action(:load_schedule, only: %i[show edit update destroy])

  def index
    authorize(Schedule)

    @schedules = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @schedule = authorize(scope.new(schedulable: @schedulable))
  end

  def edit
  end

  def create
    @schedule = authorize(scope.new(schedule_params))

    if @schedule.save
      log_in(@schedule.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @schedule.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    if @schedule.update(schedule_params)
      log_in(@schedule.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @schedule.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @schedule.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Schedule)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Schedule)

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

  def load_schedulable
    if params[:program_id].present?
      @schedulable = program_scope.find(params[:program_id])
      set_error_context(program: @schedulable)
    elsif params[:prompt_id].present?
      @schedulable = prompt_scope.find(params[:prompt_id])
      set_error_context(prompt: @schedulable)
    end
  end

  def scope
    scope = searched_policy_scope(Schedule)
    scope = scope.where(schedulable: @schedulable) if @schedulable
    scope
  end

  def program_scope
    scope = policy_scope(Program)
    scope = scope.where(user: @user) if @user
    scope
  end

  def prompt_scope
    scope = policy_scope(Prompt)
    scope = scope.where(user: @user) if @user
    scope
  end

  def model_class
    Schedule
  end

  def model_instance
    @schedule
  end

  def nested
    [@user, @schedulable]
  end

  def id
    params[:schedule_id].presence || params[:id]
  end

  def load_schedule
    @schedule = authorize(scope.find(id))
    set_error_context(schedule: @schedule)
  end

  def schedule_params
    params.expect(schedule: %i[starts_at interval])
  end
end
