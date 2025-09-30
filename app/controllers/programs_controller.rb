# frozen_string_literal: true

class ProgramsController < ApplicationController
  before_action(:load_user)
  before_action(
    :load_program,
    only: %i[show edit update destroy evaluate reschedule unschedule]
  )

  def index
    authorize(Program)

    @programs = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
    @program_executions =
      policy_scope(ProgramExecution)
        .where(program: @program)
        .order(created_at: :desc)
        .page(params[:page])

    @program_schedules =
      policy_scope(ProgramSchedule)
        .where(program: @program)
        .order(created_at: :asc)
        .page(params[:page])
  end

  def evaluate
    ProgramEvaluateJob.perform_later(program: @program)

    head :no_content
  end

  def reschedule
    @program.reschedule!

    head :no_content
  end

  def unschedule
    @program.unschedule!

    head :no_content
  end

  def new
    @program = authorize(scope.new(user: @user))
  end

  def edit
  end

  def create
    @program = authorize(scope.new(program_params))

    if @program.save
      log_in(@program.user)

      if generate?
        @user = @program.user
        @prompt = authorize(prompts_scope.new(prompt_params))

        if @prompt.save
          PromptGenerateJob.perform_later(prompt: @prompt)
        else
          flash.now.alert = @prompt.alert
        end

        redirect_to(edit_url, notice: t(".notice"))
      else
        redirect_to(show_url, notice: t(".notice"))
      end
    else
      flash.now.alert = @program.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    if @program.update(program_params)
      log_in(@program.user)

      if generate?
        @user = @program.user
        @prompt = authorize(prompts_scope.new(prompt_params))

        if @prompt.save
          PromptGenerateJob.perform_later(prompt: @prompt)
        else
          flash.now.alert = @prompt.alert
        end

        head :no_content
      else
        redirect_to(show_url, notice: t(".notice"))
      end
    else
      flash.now.alert = @program.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @program.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Program)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Program)

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

  def scope
    scope = searched_policy_scope(Program)
    scope = scope.where(user: @user) if @user
    scope
  end

  def prompts_scope
    scope = policy_scope(Prompt)
    scope = scope.where(user: @user) if @user
    scope = scope.where(program: @program) if @program
    scope
  end

  def model_class
    Program
  end

  def model_instance
    @program
  end

  def nested
    [@user]
  end

  def id
    params[:program_id].presence || params[:id]
  end

  def load_program
    @program = authorize(scope.find(id))
    set_error_context(program: @program)
  end

  def generate?
    params.dig(:program, :generate).present?
  end

  def program_params
    if admin?
      params.expect(
        program: [
          :user_id,
          :name,
          :input,
          { program_schedules_attributes: [%i[id _destroy starts_at interval]] }
        ]
      )
    else
      params.expect(
        program: [
          :input,
          :name,
          { program_schedules_attributes: [%i[id _destroy starts_at interval]] }
        ]
      )
    end
  end

  def prompt_params_with_schedules
    if admin?
      params.expect(
        program: [
          :user_id,
          :name,
          :input,
          { program_schedules_attributes: [%i[starts_at interval]] }
        ]
      )
    else
      params.expect(
        program: [
          :input,
          :name,
          { program_schedules_attributes: [%i[starts_at interval]] }
        ]
      )
    end
  end

  def prompt_params
    prompt_params_with_schedules.transform_keys do |key|
      key == "program_schedules_attributes" ? "program_prompt_schedules_attributes" : key
    end
  end
end
