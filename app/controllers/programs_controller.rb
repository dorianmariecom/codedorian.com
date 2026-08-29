# frozen_string_literal: true

class ProgramsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action { add_breadcrumb(key: "programs.index", path: index_url) }
  before_action(
    :load_program,
    only: %i[show edit update destroy evaluate format schedule unschedule]
  )

  def index
    authorize(Program)

    @programs = scope.page(params[:page]).order(name: :asc)
    @program_schedules = program_schedules_scope
    @program_executions = program_executions_scope
    @data = data_scope

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @programs })
      end
    end
  end

  def show
    @program_executions =
      program_executions_scope.order(created_at: :desc).page(params[:page])

    @program_schedules =
      program_schedules_scope.order(created_at: :asc).page(params[:page])

    @versions = versions_scope.order(created_at: :desc).page(params[:page])

    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @program })
      end
    end
  end

  def evaluate
    program_execution =
      @program.program_executions.create!(status: :in_progress)

    perform_later(
      ProgramEvaluateJob,
      arguments: {
        program: @program,
        program_execution: program_execution
      },
      context: {
        current_user: current_user,
        user: @user,
        program: @program
      },
      current: {
        user: current_user,
        program: @program,
        program_execution: program_execution,
        locale: I18n.locale,
        time_zone: current_time_zone
      }
    )

    respond_to do |format|
      format.html { redirect_back_or_to(show_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: @program })
      end
    end
  end

  def format
    @program.format!

    respond_to do |format|
      format.html { redirect_back_or_to(show_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: @program })
      end
    end
  rescue Code::Error => e
    message = t(".alert", message: e.message)
    respond_to do |format|
      format.html { redirect_back_or_to(show_url, alert: message) }
      format.json do
        render(
          json: {
            status: :bad_request,
            messages: [message],
            data: @program
          },
          status: :bad_request
        )
      end
    end
  end

  def schedule
    @program.schedule!

    respond_to do |format|
      format.html { redirect_back_or_to(show_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: @program })
      end
    end
  end

  def unschedule
    @program.unschedule!

    respond_to do |format|
      format.html { redirect_back_or_to(show_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: @program })
      end
    end
  end

  def new
    @program = authorize(scope.new(user: @user))

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @program })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @program })
      end
    end
  end

  def create
    @program = authorize(scope.new(program_params))

    if @program.save(context: :controller)
      log_in(@program.user)
      @user = @program.user
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @program
            }
          )
        end
      end
    else
      flash.now.alert = @program.alert
      respond_to do |format|
        format.html { render(:new, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@program.alert],
              data: @program
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def update
    @program.assign_attributes(program_params)

    if @program.save(context: :controller)
      log_in(@program.user)
      @user = @program.user
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @program
            }
          )
        end
      end
    else
      flash.now.alert = @program.alert
      respond_to do |format|
        format.html { render(:edit, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@program.alert],
              data: @program
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def destroy
    @program.destroy!

    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: @program })
      end
    end
  end

  def delete
    @program.delete

    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: @program })
      end
    end
  end

  def format_all
    authorize(Program)

    scope.format_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  rescue Code::Error => e
    message = t(".alert", message: e.message)
    respond_to do |format|
      format.html { redirect_back_or_to(index_url, alert: message) }
      format.json do
        render(
          json: {
            status: :bad_request,
            messages: [message],
            data: nil
          },
          status: :bad_request
        )
      end
    end
  end

  def schedule_all
    authorize(Program)

    scope.schedule_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def unschedule_all
    authorize(Program)

    scope.unschedule_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def destroy_all
    authorize(Program)

    scope.destroy_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def delete_all
    authorize(Program)

    scope.delete_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  private

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        policy_scope(Guest).find(current_guest&.id)
      else
        policy_scope(Guest).find(params.expect(:guest_id))
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
        policy_scope(User).find(params.expect(:user_id))
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

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_program(@program) if @program
    scope
  end

  def data_scope
    scope = policy_scope(Datum)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_program(@program) if @program
    scope
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
end
