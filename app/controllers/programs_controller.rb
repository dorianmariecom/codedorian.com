# frozen_string_literal: true

class ProgramsController < ApplicationController
  before_action(:load_user)
  before_action { add_breadcrumb(key: "programs.index", path: index_url) }
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
    perform_later(
      ProgramEvaluateJob,
      arguments: {
        program: @program
      },
      context: {
        current_user: current_user,
        user: @user,
        program: @program
      }
    )

    redirect_back_or_to(show_url, notice: t(".notice"))
  end

  def reschedule
    @program.reschedule!

    redirect_back_or_to(show_url, notice: t(".notice"))
  end

  def unschedule
    @program.unschedule!

    redirect_back_or_to(show_url, notice: t(".notice"))
  end

  def new
    @program = authorize(scope.new(user: @user))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @program = authorize(scope.new(program_params))

    if @program.save
      log_in(@program.user)

      if generate?
        @user = @program.user
        @program_prompt =
          authorize(program_prompts_scope.new(program_prompt_params))

        if @program_prompt.save
          perform_later(
            ProgramPromptGenerateJob,
            arguments: {
              program_prompt: @program_prompt
            },
            context: {
              current_user: current_user,
              user: @user,
              program: @program,
              program_prompt: @program_prompt
            }
          )
        else
          flash.now.alert = @program_prompt.alert
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
        @program_prompt =
          authorize(program_prompts_scope.new(program_prompt_params))

        if @program_prompt.save
          perform_later(
            ProgramPromptGenerateJob,
            arguments: {
              program_prompt: @program_prompt
            },
            context: {
              current_user: current_user,
              user: @user,
              program: @program,
              program_prompt: @program_prompt
            }
          )
        else
          flash.now.alert = @program_prompt.alert
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

  def scope
    scope = searched_policy_scope(Program)
    scope = scope.where(user: @user) if @user
    scope
  end

  def program_prompts_scope
    scope = policy_scope(ProgramPrompt)
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
    add_breadcrumb(text: @program, path: show_url)
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

  def program_prompt_params_with_schedules
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

  def program_prompt_params
    program_prompt_params_with_schedules.transform_keys do |key|
      if key == "program_schedules_attributes"
        "program_prompt_schedules_attributes"
      else
        key
      end
    end
  end
end
