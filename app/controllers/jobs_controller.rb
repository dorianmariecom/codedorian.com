# frozen_string_literal: true

class JobsController < ApplicationController
  before_action :load_address
  before_action :load_datum
  before_action :load_device
  before_action :load_email_address
  before_action :load_error
  before_action :load_error_occurrence
  before_action :load_handle
  before_action :load_job_batch
  before_action :load_job_context
  before_action :load_message
  before_action :load_name
  before_action :load_password
  before_action :load_phone_number
  before_action :load_program_execution
  before_action :load_program_schedule
  before_action :load_step
  before_action :load_step_execution
  before_action :load_subscription
  before_action :load_subscription_execution
  before_action :load_time_zone
  before_action :load_token
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action { add_breadcrumb(key: "jobs.index", path: index_url) }
  before_action(
    :load_job,
    only: %i[show edit update destroy delete discard retry]
  )

  def index
    authorize(Job)

    @jobs = scope.page(params[:page]).order(created_at: :desc)
    @job_contexts = job_contexts_scope
    @job_processes = job_processes_scope
    @job_batches = policy_scope(JobBatch).page(params[:page])
    @job_pauses = job_pauses_scope
    @job_semaphores = job_semaphores_scope
    @job_ready_executions = job_ready_executions_scope
    @job_failed_executions = job_failed_executions_scope
    @job_scheduled_executions = job_scheduled_executions_scope
    @job_blocked_executions = job_blocked_executions_scope
    @job_claimed_executions = job_claimed_executions_scope
    @job_batch_executions = job_batch_executions_scope

    @job_recurring_executions = job_recurring_executions_scope
    @job_recurring_tasks = job_recurring_tasks_scope

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @jobs }) }
    end
  end

  def show
    @job_contexts =
      job_contexts_scope.order(created_at: :desc).page(params[:page])
    @job_ready_executions =
      job_ready_executions_scope.order(created_at: :desc).page(params[:page])
    @job_failed_executions =
      job_failed_executions_scope.order(created_at: :desc).page(params[:page])
    @job_scheduled_executions =
      job_scheduled_executions_scope.order(created_at: :desc).page(
        params[:page]
      )
    @job_blocked_executions =
      job_blocked_executions_scope.order(created_at: :desc).page(params[:page])
    @job_claimed_executions =
      job_claimed_executions_scope.order(created_at: :desc).page(params[:page])
    @job_batch_executions =
      job_batch_executions_scope.order(created_at: :desc).page(params[:page])

    @job_recurring_executions =
      job_recurring_executions_scope.order(created_at: :desc).page(
        params[:page]
      )
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @job }) }
    end
  end

  def new
    @job = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @job }) }
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: @job }) }
    end
  end

  def create
    @job = authorize(scope.new(job_params))
    persist(:new, t(".notice"))
  end

  def update
    @job.assign_attributes(job_params)
    persist(:edit, t(".notice"))
  end

  def retry
    @job.retry!

    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: @job })
      end
    end
  end

  def discard
    @job.discard!

    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: @job })
      end
    end
  end

  def delete
    @job.delete
    respond_after_delete(t(".notice"))
  end

  def destroy
    @job.destroy!
    respond_after_delete(t(".notice"))
  end

  def retry_all
    authorize(Job)

    scope.retry_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def discard_all
    authorize(Job)

    scope.discard_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def destroy_all
    authorize(Job)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(Job)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

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

  def load_job_context
    return if params[:job_context_id].blank?

    @job_context = policy_scope(JobContext).find(params.expect(:job_context_id))
    set_context(job_context: @job_context)
    add_breadcrumb(text: @job_context, path: @job_context)
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

  def load_step
    return if params[:step_id].blank?

    @step = policy_scope(Step).find(params.expect(:step_id))
    set_context(step: @step)
    add_breadcrumb(text: @step, path: @step)
  end

  def load_step_execution
    return if params[:step_execution_id].blank?

    @step_execution =
      policy_scope(StepExecution).find(params.expect(:step_execution_id))
    set_context(step_execution: @step_execution)
    add_breadcrumb(text: @step_execution, path: @step_execution)
  end

  def load_subscription
    return if params[:subscription_id].blank?

    @subscription =
      policy_scope(Subscription).find(params.expect(:subscription_id))
    set_context(subscription: @subscription)
    add_breadcrumb(text: @subscription, path: @subscription)
  end

  def load_subscription_execution
    return if params[:subscription_execution_id].blank?

    @subscription_execution =
      policy_scope(SubscriptionExecution).find(
        params.expect(:subscription_execution_id)
      )
    set_context(subscription_execution: @subscription_execution)
    add_breadcrumb(text: @subscription_execution, path: @subscription_execution)
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
      address_id: @address&.id,
      datum_id: @datum&.id,
      device_id: @device&.id,
      email_address_id: @email_address&.id,
      error_id: @error&.id,
      error_occurrence_id: @error_occurrence&.id,
      handle_id: @handle&.id,
      job_batch_id: @job_batch&.id,
      job_context_id: @job_context&.id,
      message_id: @message&.id,
      name_id: @name&.id,
      password_id: @password&.id,
      phone_number_id: @phone_number&.id,
      program_execution_id: @program_execution&.id,
      program_schedule_id: @program_schedule&.id,
      step_id: @step&.id,
      step_execution_id: @step_execution&.id,
      subscription_id: @subscription&.id,
      subscription_execution_id: @subscription_execution&.id,
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
    @job = authorize(scope.find(id))

    set_context(job: @job)
    add_breadcrumb(text: @job, path: show_url)
  end

  def id
    params[:job_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(Job)

    if @program
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
    scope = scope.where_job_context(@job_context) if @job_context
    scope = scope.where_message(@message) if @message
    scope = scope.where_name(@name) if @name
    scope = scope.where_password(@password) if @password
    scope = scope.where_phone_number(@phone_number) if @phone_number
    if @program_execution
      scope = scope.where_program_execution(@program_execution)
    end
    scope = scope.where_program_schedule(@program_schedule) if @program_schedule
    scope = scope.where_step(@step) if @step
    scope = scope.where_step_execution(@step_execution) if @step_execution
    scope = scope.where_subscription(@subscription) if @subscription
    if @subscription_execution
      scope = scope.where_subscription_execution(@subscription_execution)
    end
    scope = scope.where_time_zone(@time_zone) if @time_zone
    scope = scope.where_token(@token) if @token
    scope
  end

  def programs_scope
    scope = policy_scope(Program)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def job_contexts_scope
    scope = policy_scope(JobContext)

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_processes_scope
    policy_scope(JobProcess)
  end

  def job_pauses_scope
    policy_scope(JobPause)
  end

  def job_semaphores_scope
    policy_scope(JobSemaphore)
  end

  def job_ready_executions_scope
    scope = policy_scope(JobReadyExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_failed_executions_scope
    scope = policy_scope(JobFailedExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_scheduled_executions_scope
    scope = policy_scope(JobScheduledExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_blocked_executions_scope
    scope = policy_scope(JobBlockedExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_claimed_executions_scope
    scope = policy_scope(JobClaimedExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_batch_executions_scope
    scope = policy_scope(JobBatchExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_recurring_executions_scope
    scope = policy_scope(JobRecurringExecution)

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_recurring_tasks_scope
    policy_scope(JobRecurringTask)
  end

  def logs_scope
    scope = policy_scope(Log)

    scope = scope.where_job(@job) if @job

    scope
  end

  def model_class
    Job
  end

  def model_instance
    @job
  end

  def nested(user: @user, guest: @guest, program: @program)
    [user || guest, program].compact
  end

  def filters
    %i[user program]
  end

  def job_params
    if admin?
      params.expect(
        job: %i[
          active_job_id
          batch_id
          arguments
          class_name
          concurrency_key
          finished_at
          priority
          queue_name
          scheduled_at
        ]
      )
    else
      {}
    end
  end
end
