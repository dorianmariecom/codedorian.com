# frozen_string_literal: true

class JobContextsController < ApplicationController
  before_action :load_job_recurring_task
  before_action :load_job_process
  before_action :load_address
  before_action :load_datum
  before_action :load_device
  before_action :load_email_address
  before_action :load_error
  before_action :load_error_occurrence
  before_action :load_handle
  before_action :load_job_batch
  before_action :load_job_batch_execution
  before_action :load_job_blocked_execution
  before_action :load_job_claimed_execution
  before_action :load_job_failed_execution
  before_action :load_job_ready_execution
  before_action :load_job_recurring_execution
  before_action :load_job_scheduled_execution
  before_action :load_message
  before_action :load_name
  before_action :load_password
  before_action :load_phone_number
  before_action :load_program_execution
  before_action :load_program_schedule
  before_action :load_time_zone
  before_action :load_token
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_job)
  before_action { add_breadcrumb(key: "job_contexts.index", path: index_url) }
  before_action(:load_job_context, only: %i[show edit update destroy delete])

  def index
    authorize(JobContext)

    @job_contexts = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_contexts })
      end
    end
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_context })
      end
    end
  end

  def new
    @job_context = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_context })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_context })
      end
    end
  end

  def create
    @job_context = authorize(scope.new(job_context_params))
    persist(:new, t(".notice"))
  end

  def update
    @job_context.assign_attributes(job_context_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @job_context.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @job_context.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(JobContext)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(JobContext)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_job_recurring_task
    return if params[:job_recurring_task_id].blank?

    @job_recurring_task =
      policy_scope(JobRecurringTask).find(params.expect(:job_recurring_task_id))
    set_context(job_recurring_task: @job_recurring_task)
    add_breadcrumb(text: @job_recurring_task, path: @job_recurring_task)
  end

  def load_job_process
    return if params[:job_process_id].blank?

    @job_process = policy_scope(JobProcess).find(params.expect(:job_process_id))
    set_context(job_process: @job_process)
    add_breadcrumb(text: @job_process, path: @job_process)
  end

  def load_address
    return if params[:address_id].blank?

    @address = policy_scope(Address).find(params.expect(:address_id))
    set_context(address: @address)
    add_breadcrumb(text: @address, path: @address)
  end

  def load_datum
    return if params[:datum_id].blank?

    @datum = policy_scope(Datum).find(params.expect(:datum_id))
    set_context(datum: @datum)
    add_breadcrumb(text: @datum, path: @datum)
  end

  def load_device
    return if params[:device_id].blank?

    @device = policy_scope(Device).find(params.expect(:device_id))
    set_context(device: @device)
    add_breadcrumb(text: @device, path: @device)
  end

  def load_email_address
    return if params[:email_address_id].blank?

    @email_address =
      policy_scope(EmailAddress).find(params.expect(:email_address_id))
    set_context(email_address: @email_address)
    add_breadcrumb(text: @email_address, path: @email_address)
  end

  def load_error
    return if params[:error_id].blank?

    @error = policy_scope(::Error).find(params.expect(:error_id))
    set_context(error: @error)
    add_breadcrumb(text: @error, path: @error)
  end

  def load_error_occurrence
    return if params[:error_occurrence_id].blank?

    @error_occurrence =
      policy_scope(ErrorOccurrence).find(params.expect(:error_occurrence_id))
    set_context(error_occurrence: @error_occurrence)
    add_breadcrumb(text: @error_occurrence, path: @error_occurrence)
  end

  def load_handle
    return if params[:handle_id].blank?

    @handle = policy_scope(Handle).find(params.expect(:handle_id))
    set_context(handle: @handle)
    add_breadcrumb(text: @handle, path: @handle)
  end

  def load_job_batch
    return if params[:job_batch_id].blank?

    @job_batch = policy_scope(JobBatch).find(params.expect(:job_batch_id))
    set_context(job_batch: @job_batch)
    add_breadcrumb(text: @job_batch, path: @job_batch)
  end

  def load_job_batch_execution
    return if params[:job_batch_execution_id].blank?

    @job_batch_execution =
      policy_scope(JobBatchExecution).find(
        params.expect(:job_batch_execution_id)
      )
    set_context(job_batch_execution: @job_batch_execution)
    add_breadcrumb(text: @job_batch_execution, path: @job_batch_execution)
  end

  def load_job_blocked_execution
    return if params[:job_blocked_execution_id].blank?

    @job_blocked_execution =
      policy_scope(JobBlockedExecution).find(
        params.expect(:job_blocked_execution_id)
      )
    set_context(job_blocked_execution: @job_blocked_execution)
    add_breadcrumb(text: @job_blocked_execution, path: @job_blocked_execution)
  end

  def load_job_claimed_execution
    return if params[:job_claimed_execution_id].blank?

    @job_claimed_execution =
      policy_scope(JobClaimedExecution).find(
        params.expect(:job_claimed_execution_id)
      )
    set_context(job_claimed_execution: @job_claimed_execution)
    add_breadcrumb(text: @job_claimed_execution, path: @job_claimed_execution)
  end

  def load_job_failed_execution
    return if params[:job_failed_execution_id].blank?

    @job_failed_execution =
      policy_scope(JobFailedExecution).find(
        params.expect(:job_failed_execution_id)
      )
    set_context(job_failed_execution: @job_failed_execution)
    add_breadcrumb(text: @job_failed_execution, path: @job_failed_execution)
  end

  def load_job_ready_execution
    return if params[:job_ready_execution_id].blank?

    @job_ready_execution =
      policy_scope(JobReadyExecution).find(
        params.expect(:job_ready_execution_id)
      )
    set_context(job_ready_execution: @job_ready_execution)
    add_breadcrumb(text: @job_ready_execution, path: @job_ready_execution)
  end

  def load_job_recurring_execution
    return if params[:job_recurring_execution_id].blank?

    @job_recurring_execution =
      policy_scope(JobRecurringExecution).find(
        params.expect(:job_recurring_execution_id)
      )
    set_context(job_recurring_execution: @job_recurring_execution)
    add_breadcrumb(
      text: @job_recurring_execution,
      path: @job_recurring_execution
    )
  end

  def load_job_scheduled_execution
    return if params[:job_scheduled_execution_id].blank?

    @job_scheduled_execution =
      policy_scope(JobScheduledExecution).find(
        params.expect(:job_scheduled_execution_id)
      )
    set_context(job_scheduled_execution: @job_scheduled_execution)
    add_breadcrumb(
      text: @job_scheduled_execution,
      path: @job_scheduled_execution
    )
  end

  def load_message
    return if params[:message_id].blank?

    @message = policy_scope(Message).find(params.expect(:message_id))
    set_context(message: @message)
    add_breadcrumb(text: @message, path: @message)
  end

  def load_name
    return if params[:name_id].blank?

    @name = policy_scope(Name).find(params.expect(:name_id))
    set_context(name: @name)
    add_breadcrumb(text: @name, path: @name)
  end

  def load_password
    return if params[:password_id].blank?

    @password = policy_scope(Password).find(params.expect(:password_id))
    set_context(password: @password)
    add_breadcrumb(text: @password, path: @password)
  end

  def load_phone_number
    return if params[:phone_number_id].blank?

    @phone_number =
      policy_scope(PhoneNumber).find(params.expect(:phone_number_id))
    set_context(phone_number: @phone_number)
    add_breadcrumb(text: @phone_number, path: @phone_number)
  end

  def load_program_execution
    return if params[:program_execution_id].blank?

    @program_execution =
      policy_scope(ProgramExecution).find(params.expect(:program_execution_id))
    set_context(program_execution: @program_execution)
    add_breadcrumb(text: @program_execution, path: @program_execution)
  end

  def load_program_schedule
    return if params[:program_schedule_id].blank?

    @program_schedule =
      policy_scope(ProgramSchedule).find(params.expect(:program_schedule_id))
    set_context(program_schedule: @program_schedule)
    add_breadcrumb(text: @program_schedule, path: @program_schedule)
  end

  def load_time_zone
    return if params[:time_zone_id].blank?

    @time_zone = policy_scope(TimeZone).find(params.expect(:time_zone_id))
    set_context(time_zone: @time_zone)
    add_breadcrumb(text: @time_zone, path: @time_zone)
  end

  def load_token
    return if params[:token_id].blank?

    @token = policy_scope(Token).find(params.expect(:token_id))
    set_context(token: @token)
    add_breadcrumb(text: @token, path: @token)
  end

  def parent_params
    {
      job_recurring_task_id: @job_recurring_task&.id,
      job_process_id: @job_process&.id,
      address_id: @address&.id,
      datum_id: @datum&.id,
      device_id: @device&.id,
      email_address_id: @email_address&.id,
      error_id: @error&.id,
      error_occurrence_id: @error_occurrence&.id,
      handle_id: @handle&.id,
      job_batch_id: @job_batch&.id,
      job_batch_execution_id: @job_batch_execution&.id,
      job_blocked_execution_id: @job_blocked_execution&.id,
      job_claimed_execution_id: @job_claimed_execution&.id,
      job_failed_execution_id: @job_failed_execution&.id,
      job_ready_execution_id: @job_ready_execution&.id,
      job_recurring_execution_id: @job_recurring_execution&.id,
      job_scheduled_execution_id: @job_scheduled_execution&.id,
      message_id: @message&.id,
      name_id: @name&.id,
      password_id: @password&.id,
      phone_number_id: @phone_number&.id,
      program_execution_id: @program_execution&.id,
      program_schedule_id: @program_schedule&.id,
      time_zone_id: @time_zone&.id,
      token_id: @token&.id
    }.compact
  end

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

  def load_job
    return if params[:job_id].blank?

    @job = jobs_scope.find(params.expect(:job_id))

    set_context(job: @job)
    add_breadcrumb(key: "jobs.index", path: [@user, :jobs])
    add_breadcrumb(text: @job, path: [@user, @job])
  end

  def id
    params[:job_context_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(JobContext)
    if @job_recurring_task
      scope = scope.where_job_recurring_task(@job_recurring_task)
    end
    scope = scope.where_job_process(@job_process) if @job_process

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope = scope.where_address(@address) if @address
    scope = scope.where_datum(@datum) if @datum
    scope = scope.where_device(@device) if @device
    scope = scope.where_email_address(@email_address) if @email_address
    scope = scope.where_error(@error) if @error
    scope = scope.where_error_occurrence(@error_occurrence) if @error_occurrence
    scope = scope.where_handle(@handle) if @handle
    scope = scope.where_job_batch(@job_batch) if @job_batch
    if @job_batch_execution
      scope = scope.where_job_batch_execution(@job_batch_execution)
    end
    if @job_blocked_execution
      scope = scope.where_job_blocked_execution(@job_blocked_execution)
    end
    if @job_claimed_execution
      scope = scope.where_job_claimed_execution(@job_claimed_execution)
    end
    if @job_failed_execution
      scope = scope.where_job_failed_execution(@job_failed_execution)
    end
    if @job_ready_execution
      scope = scope.where_job_ready_execution(@job_ready_execution)
    end
    if @job_recurring_execution
      scope = scope.where_job_recurring_execution(@job_recurring_execution)
    end
    if @job_scheduled_execution
      scope = scope.where_job_scheduled_execution(@job_scheduled_execution)
    end
    scope = scope.where_message(@message) if @message
    scope = scope.where_name(@name) if @name
    scope = scope.where_password(@password) if @password
    scope = scope.where_phone_number(@phone_number) if @phone_number
    if @program_execution
      scope = scope.where_program_execution(@program_execution)
    end
    scope = scope.where_program_schedule(@program_schedule) if @program_schedule
    scope = scope.where_time_zone(@time_zone) if @time_zone
    scope = scope.where_token(@token) if @token
    scope
  end

  def versions_scope
    scope = policy_scope(Version)

    scope = scope.where_job_context(@job_context) if @job_context

    scope
  end

  def programs_scope
    scope = policy_scope(Program)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def jobs_scope
    scope = policy_scope(Job)

    if @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def logs_scope
    scope = policy_scope(Log)

    scope = scope.where_job_context(@job_context) if @job_context

    scope
  end

  def model_class
    JobContext
  end

  def model_instance
    @job_context
  end

  def nested(user: @user, guest: @guest, program: @program, job: @job)
    [user || guest, program, job].compact
  end

  def filters
    %i[user program job]
  end

  def load_job_context
    @job_context = authorize(scope.find(id))
    set_context(job_context: @job_context)
    add_breadcrumb(text: @job_context, path: show_url)
  end

  def job_context_params
    admin? ? params.expect(job_context: %i[active_job_id context]) : {}
  end
end
