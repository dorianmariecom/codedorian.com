# frozen_string_literal: true

class ProgramsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action { add_breadcrumb(key: "programs.index", path: index_url) }
  before_action(
    :load_program,
    only: %i[show edit update destroy evaluate schedule unschedule]
  )

  def index
    authorize(Program)

    @programs = scope.page(params[:page]).order(name: :asc)
    @program_prompts = program_prompts_scope
    @program_schedules = program_schedules_scope
    @program_executions = program_executions_scope
    @program_prompt_schedules = program_prompt_schedules_scope
    @repl_sessions = repl_sessions_scope
    @repl_programs = repl_programs_scope
    @repl_prompts = repl_prompts_scope
    @repl_executions = repl_executions_scope
    @data = data_scope
    @attachments = attachments_scope
    @examples = examples_scope
  end

  def show
    @program_executions =
      program_executions_scope.order(created_at: :desc).page(params[:page])

    @program_schedules =
      program_schedules_scope.order(created_at: :asc).page(params[:page])

    @program_prompts =
      program_prompts_scope.order(created_at: :asc).page(params[:page])

    @program_prompt_schedules =
      program_prompt_schedules_scope.order(created_at: :asc).page(params[:page])
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
      },
      current: {
        user: current_user,
        program: @program
      }
    )

    redirect_back_or_to(show_url, notice: t(".notice"))
  end

  def schedule
    @program.schedule!

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

    if @program.save(context: :controller)
      log_in(@program.user)

      if generate?
        @user = @program.user
        @program_prompt =
          authorize(program_prompts_scope.new(program_prompt_params))

        if @program_prompt.save(context: :controller)
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
            },
            current: {
              user: current_user,
              program: @program
            }
          )
        else
          flash.now.alert = @program_prompt.alert
        end

        redirect_to(edit_url)
      else
        redirect_to(show_url, notice: t(".notice"))
      end
    else
      flash.now.alert = @program.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @program.assign_attributes(program_params)

    if @program.save(context: :controller)
      log_in(@program.user)

      if generate?
        @user = @program.user
        @program_prompt =
          authorize(program_prompts_scope.new(program_prompt_params))

        if @program_prompt.save(context: :controller)
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
            },
            current: {
              user: current_user,
              program: @program
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
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @program.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @program.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def schedule_all
    authorize(Program)

    scope.schedule_all

    redirect_back_or_to(index_url)
  end

  def unschedule_all
    authorize(Program)

    scope.unschedule_all

    redirect_back_or_to(index_url)
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

  def scope
    scope = searched_policy_scope(Program)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def program_prompts_scope
    scope = policy_scope(ProgramPrompt)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope
  end

  def program_schedules_scope
    scope = policy_scope(ProgramSchedule)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope
  end

  def program_executions_scope
    scope = policy_scope(ProgramExecution)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope
  end

  def program_prompt_schedules_scope
    scope = policy_scope(ProgramPromptSchedule)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope
  end

  def repl_sessions_scope
    scope = policy_scope(ReplSession)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def repl_programs_scope
    scope = policy_scope(ReplProgram)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def repl_prompts_scope
    scope = policy_scope(ReplPrompt)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def repl_executions_scope
    scope = policy_scope(ReplExecution)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def data_scope
    scope = policy_scope(Datum)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def attachments_scope
    scope = policy_scope(Attachment)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def examples_scope
    policy_scope(Example)
  end

  def model_class
    Program
  end

  def model_instance
    @program
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
  end

  def id
    params[:program_id].presence || params[:id]
  end

  def load_program
    @program = authorize(scope.find(id))
    set_context(program: @program)
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
