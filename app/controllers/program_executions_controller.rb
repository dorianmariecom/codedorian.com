# frozen_string_literal: true

class ProgramExecutionsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action do
    add_breadcrumb(key: "program_executions.index", path: index_url)
  end
  before_action(
    :load_program_execution,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(ProgramExecution)

    @program_executions = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @program_execution = authorize(scope.new(program: @program))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @program_execution = authorize(scope.new(program_execution_params))

    if @program_execution.save(context: :controller)
      log_in(@program_execution.user)
      @user = @program_execution.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @program_execution.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @program_execution.assign_attributes(program_execution_params)

    if @program_execution.save(context: :controller)
      log_in(@program_execution.user)
      @user = @program_execution.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @program_execution.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @program_execution.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @program_execution.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(ProgramExecution)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(ProgramExecution)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
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

  def load_program
    return if params[:program_id].blank?

    @program = programs_scope.find(params[:program_id])

    set_context(program: @program)
    add_breadcrumb(key: "programs.index", path: [@user, :programs])
    add_breadcrumb(text: @program, path: [@user, @program])
  end

  def scope
    scope = searched_policy_scope(ProgramExecution)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    if @program_execution
      scope = scope.where_program_execution(@program_execution)
    end
    scope
  end

  def programs_scope
    scope = policy_scope(Program)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    if @program_execution
      scope = scope.where_program_execution(@program_execution)
    end
    scope
  end

  def model_class
    ProgramExecution
  end

  def model_instance
    @program_execution
  end

  def nested(user: @user, guest: @guest, program: @program)
    [user || guest, program]
  end

  def filters
    %i[user program]
  end

  def id
    params[:program_execution_id].presence || params[:id]
  end

  def load_program_execution
    @program_execution = authorize(scope.find(id))
    set_context(program_execution: @program_execution)
    add_breadcrumb(text: @program_execution, path: show_url)
  end

  def program_execution_params
    if admin?
      params.expect(
        program_execution: %i[
          program_id
          status
          input
          output
          result
          error
          error_class
          error_message
          error_backtrace
        ]
      )
    else
      params.expect(
        program_execution: %i[input output result error error_class]
      )
    end
  end
end
