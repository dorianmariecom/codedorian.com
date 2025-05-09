# frozen_string_literal: true

class SchedulesController < ApplicationController
  before_action :load_user
  before_action :load_program
  before_action :load_schedule, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url

  def index
    authorize Schedule

    @schedules = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @schedule = authorize scope.new(program: @program)
  end

  def edit
  end

  def create
    @schedule = authorize scope.new(schedule_params)

    if @schedule.save
      log_in(@schedule.user)
      redirect_to @schedule, notice: t(".notice")
    else
      flash.now.alert = @schedule.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @schedule.update(schedule_params)
      log_in(@schedule.user)
      redirect_to @schedule, notice: t(".notice")
    else
      flash.now.alert = @schedule.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @schedule.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize Schedule

    scope.destroy_all

    redirect_back_or_to(schedules_path)
  end

  private

  def load_user
    if params[:user_id] == "me"
      @user = policy_scope(User).find(current_user&.id)
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def load_program
    return if params[:program_id].blank?

    @program =
      if @user
        policy_scope(Program).where(user: @user).find(params[:program_id])
      else
        policy_scope(Program).find(params[:program_id])
      end
  end

  def scope
    scope = searched_policy_scope(Schedule)
    scope = scope.where(progran: @program) if @program
    scope = scope.joins(:program).where(program: { user: @user }) if @user
    scope
  end

  def url
    [@user, @program, :schedules].compact
  end

  def new_url
    [:new, @user, @program, :schedule].compact
  end

  def id
    params[:schedule_id].presence || params[:id]
  end

  def load_schedule
    @schedule = authorize scope.find(id)
  end

  def schedule_params
    params.expect(schedule: %i[program_id starts_at interval])
  end
end
