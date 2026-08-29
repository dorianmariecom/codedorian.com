# frozen_string_literal: true

class ProgramSchedulesController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action do
    add_breadcrumb(key: "program_schedules.index", path: index_url)
  end
  before_action(
    :load_program_schedule,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(ProgramSchedule)

    @program_schedules = scope.page(params[:page]).order(created_at: :asc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @program_schedules })
      end
    end
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @program_schedule })
      end
    end
  end

  def new
    @program_schedule = authorize(scope.new(program: @program))

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @program_schedule })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @program_schedule })
      end
    end
  end

  def create
    @program_schedule =
      authorize(
        scope.new(
          if @program.present?
            program_schedule_params.except(:program_id).merge(program: @program)
          else
            program_schedule_params
          end
        )
      )
    persist(:new, t(".notice")) do
      log_in(@program_schedule.user)
      @user = @program_schedule.user
    end
  end

  def update
    @program_schedule.assign_attributes(program_schedule_params)
    persist(:edit, t(".notice")) do
      log_in(@program_schedule.user)
      @user = @program_schedule.user
    end
  end

  def destroy
    @program_schedule.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @program_schedule.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(ProgramSchedule)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(ProgramSchedule)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
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

  def load_program
    return if params[:program_id].blank?

    @program = programs_scope.find(params.expect(:program_id))

    set_context(program: @program)
    add_breadcrumb(key: "programs.index", path: [@user, :programs])
    add_breadcrumb(text: @program, path: [@user, @program])
  end

  def scope
    scope = searched_policy_scope(ProgramSchedule)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_program_schedule(@program_schedule) if @program_schedule
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
    scope = scope.where_program_schedule(@program_schedule) if @program_schedule
    scope
  end

  def model_class
    ProgramSchedule
  end

  def model_instance
    @program_schedule
  end

  def nested(user: @user, guest: @guest, program: @program)
    [user || guest, program]
  end

  def filters
    %i[user program]
  end

  def id
    params[:program_schedule_id].presence || params[:id]
  end

  def load_program_schedule
    @program_schedule = authorize(scope.find(id))
    set_context(program_schedule: @program_schedule)
    add_breadcrumb(text: @program_schedule, path: show_url)
  end

  def program_schedule_params
    params.expect(program_schedule: %i[program_id starts_at interval])
  end
end
