# frozen_string_literal: true

class ProgramsController < ApplicationController
  before_action :load_user
  before_action :load_program,
                only: %i[show edit update destroy evaluate schedule unschedule]

  helper_method :url
  helper_method :new_url

  def index
    authorize Program

    @programs = scope.page(params[:page])
  end

  def show
    @executions =
      policy_scope(Execution)
        .where(program: @program)
        .order(created_at: :desc)
        .page(params[:page])

    @schedules =
      policy_scope(Schedule)
        .where(program: @program)
        .order(created_at: :desc)
        .page(params[:page])
  end

  def evaluate
    @program.evaluate!

    redirect_back_or_to(@program)
  end

  def schedule
    @program.schedule!

    redirect_back_or_to(@program)
  end

  def unschedule
    @program.unschedule!

    redirect_back_or_to(@program)
  end

  def new
    @program = authorize scope.new
  end

  def edit
  end

  def create
    @program = authorize scope.new(program_params)

    if @program.save
      log_in(@program.user)
      redirect_to @program, notice: t(".notice")
    else
      flash.now.alert = @program.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @program.update(program_params)
      log_in(@program.user)
      redirect_to @program, notice: t(".notice")
    else
      flash.now.alert = @program.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @program.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize Program

    scope.destroy_all

    redirect_back_or_to(programs_path)
  end

  private

  def load_user
    if params[:user_id] == "me"
      @user = current_user
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def scope
    @user ? policy_scope(Program).where(user: @user) : policy_scope(Program)
  end

  def url
    @user ? [@user, :programs] : programs_path
  end

  def new_url
    @user ? [:new, @user, :program] : new_program_path
  end

  def id
    params[:program_id].presence || params[:id]
  end

  def load_program
    @program = authorize scope.find(id)
  end

  def program_params
    if admin?
      params.expect(
        program: [
          :user_id,
          :name,
          :input,
          { schedules_attributes: %i[id _destroy starts_at interval] }
        ]
      )
    else
      params.expect(
        program: [
          :input,
          :name,
          { schedules_attributes: %i[id _destroy starts_at interval] }
        ]
      )
    end
  end
end
