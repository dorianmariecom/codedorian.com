# frozen_string_literal: true

class ProgramsController < ApplicationController
  before_action :load_user
  before_action :load_program,
                only: %i[show edit update destroy evaluate schedule unschedule]

  helper_method :url
  helper_method :new_url
  helper_method :prompts_url
  helper_method :delete_all_url
  helper_method :destroy_all_url

  def index
    authorize Program

    @programs = scope.page(params[:page]).order(created_at: :asc)
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
        .order(created_at: :asc)
        .page(params[:page])
  end

  def evaluate
    @program.evaluate!(params: params[:code])

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
    @program = authorize scope.new(user: @user)
  end

  def edit
  end

  def create
    @program = authorize scope.new(program_params)

    if generate?
      @prompt = authorize prompt_scope.new(prompt_params)
      @program.schedules = @prompt.program_schedules

      if @prompt.save
        log_in(@prompt.user)
        GenerateJob.perform_later(prompt: @prompt)
        render :new
      else
        flash.now.alert = @prompt.alert
        render :new, status: :unprocessable_entity
      end
    elsif @program.save
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

    redirect_back_or_to(url)
  end

  def delete_all
    authorize Program

    scope.delete_all

    redirect_back_or_to(url)
  end

  private

  def load_user
    if params[:user_id] == "me"
      @user = policy_scope(User).find(current_user&.id)
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def scope
    scope = searched_policy_scope(Program)
    scope = scope.where(user: @user) if @user
    scope
  end

  def prompt_scope
    scope = searched_policy_scope(Prompt)
    scope = scope.where(user: @user) if @user
    scope = scope.where(program: @program) if @program
    scope
  end

  def url
    [@user, :programs].compact
  end

  def new_url
    [:new, @user, :program].compact
  end

  def prompts_url
    [@user, @program.persisted? ? @program : nil, :prompts].compact
  end

  def delete_all_url
    [:delete_all, @user, :programs, { search: { q: q } }].compact
  end

  def destroy_all_url
    [:destroy_all, @user, :programs, { search: { q: q } }].compact
  end

  def id
    params[:program_id].presence || params[:id]
  end

  def load_program
    @program = authorize scope.find(id)
  end

  def generate?
    program_action == "generate"
  end

  def program_action
    params.dig(:program, :action)
  end

  def program_params
    if admin?
      params.expect(
        program: [
          :user_id,
          :name,
          :input,
          { schedules_attributes: [%i[id _destroy starts_at interval]] }
        ]
      )
    else
      params.expect(
        program: [
          :input,
          :name,
          { schedules_attributes: [%i[id _destroy starts_at interval]] }
        ]
      )
    end
  end

  def prompt_params
    if admin?
      params.expect(
        program: [
          :user_id,
          :name,
          :input,
          { schedules_attributes: [%i[id _destroy starts_at interval]] }
        ]
      )
    else
      params.expect(
        program: [
          :input,
          :name,
          { schedules_attributes: [%i[id _destroy starts_at interval]] }
        ]
      )
    end
  end
end
