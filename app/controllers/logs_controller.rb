# frozen_string_literal: true

class LogsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_program_prompt)
  before_action(:load_program_prompt_schedule)
  before_action(:load_program_execution)
  before_action(:load_program_schedule)
  before_action(:load_job)
  before_action(:load_job_context)
  before_action(:load_job_process)
  before_action(:load_job_pause)
  before_action(:load_job_semaphore)
  before_action(:load_job_ready_execution)
  before_action(:load_job_failed_execution)
  before_action(:load_job_scheduled_execution)
  before_action(:load_job_blocked_execution)
  before_action(:load_job_claimed_execution)
  before_action(:load_job_recurring_execution)
  before_action(:load_job_recurring_task)
  before_action(:load_error)
  before_action(:load_error_occurrence)
  before_action(:load_address)
  before_action(:load_configuration)
  before_action(:load_country_code_ip_address)
  before_action(:load_datum)
  before_action(:load_device)
  before_action(:load_email_address)
  before_action(:load_example)
  before_action(:load_example_schedule)
  before_action(:load_handle)
  before_action(:load_parent_log)
  before_action(:load_message)
  before_action(:load_name)
  before_action(:load_password)
  before_action(:load_phone_number)
  before_action(:load_session)
  before_action(:load_time_zone)
  before_action(:load_token)
  before_action(:load_version)
  before_action { add_breadcrumb(key: "logs.index", path: index_url) }
  before_action(:load_log, only: %i[show edit update destroy delete])

  def index
    authorize(Log)

    @logs = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @log = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @log = authorize(scope.new(log_params))

    if @log.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @log.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @log.assign_attributes(log_params)

    if @log.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @log.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @log.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @log.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(Log)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Log)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        guests_scope.find(current_guest&.id)
      else
        guests_scope.find(params[:guest_id])
      end

    set_context(guest: @guest)
    add_breadcrumb(key: "guests.index", path: :guests)
    add_breadcrumb(text: @guest, path: @guest)
  end

  def load_user
    return if params[:user_id].blank?

    @user =
      if params[:user_id] == "me"
        users_scope.find(current_user&.id)
      else
        users_scope.find(params[:user_id])
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

  def load_program_prompt
    return if params[:program_prompt_id].blank?

    @program_prompt = program_prompts_scope.find(params[:program_prompt_id])

    set_context(program_prompt: @program_prompt)
    add_breadcrumb(
      key: "program_prompts.index",
      path: [@user, @program, :program_prompts]
    )
    add_breadcrumb(
      text: @program_prompt,
      path: [@user, @program, @program_prompt]
    )
  end

  def load_program_prompt_schedule
    return if params[:program_prompt_schedule_id].blank?

    @program_prompt_schedule =
      program_prompt_schedules_scope.find(params[:program_prompt_schedule_id])

    set_context(program_prompt_schedule: @program_prompt_schedule)
    add_breadcrumb(
      key: "program_prompt_schedules.index",
      path: [@user, @program, @program_prompt, :program_prompt_schedules]
    )
    add_breadcrumb(
      text: @program_prompt_schedule,
      path: [@user, @program, @program_prompt, @program_prompt_schedule]
    )
  end

  def load_program_execution
    return if params[:program_execution_id].blank?

    @program_execution =
      program_executions_scope.find(params[:program_execution_id])

    set_context(program_execution: @program_execution)
    add_breadcrumb(
      key: "program_executions.index",
      path: [@user, @program, :program_executions]
    )
    add_breadcrumb(
      text: @program_execution,
      path: [@user, @program, @program_execution]
    )
  end

  def load_program_schedule
    return if params[:program_schedule_id].blank?

    @program_schedule =
      program_schedules_scope.find(params[:program_schedule_id])

    set_context(program_schedule: @program_schedule)
    add_breadcrumb(
      key: "program_schedules.index",
      path: [@user, @program, :program_schedules]
    )
    add_breadcrumb(
      text: @program_schedule,
      path: [@user, @program, @program_schedule]
    )
  end

  def load_job
    return if params[:job_id].blank?

    @job = jobs_scope.find(params[:job_id])

    set_context(job: @job)
    add_breadcrumb(text: @job, path: [*nested, @job].uniq)
  end

  def load_job_context
    return if params[:job_context_id].blank?

    @job_context = job_contexts_scope.find(params[:job_context_id])

    set_context(job_context: @job_context)
    add_breadcrumb(text: @job_context, path: [*nested, @job_context].uniq)
  end

  def load_job_process
    return if params[:job_process_id].blank?

    @job_process = job_processes_scope.find(params[:job_process_id])

    set_context(job_process: @job_process)
    add_breadcrumb(text: @job_process, path: [*nested, @job_process].uniq)
  end

  def load_job_pause
    return if params[:job_pause_id].blank?

    @job_pause = job_pauses_scope.find(params[:job_pause_id])

    set_context(job_pause: @job_pause)
    add_breadcrumb(text: @job_pause, path: [*nested, @job_pause].uniq)
  end

  def load_job_semaphore
    return if params[:job_semaphore_id].blank?

    @job_semaphore = job_semaphores_scope.find(params[:job_semaphore_id])

    set_context(job_semaphore: @job_semaphore)
    add_breadcrumb(text: @job_semaphore, path: [*nested, @job_semaphore].uniq)
  end

  def load_job_ready_execution
    return if params[:job_ready_execution_id].blank?

    @job_ready_execution =
      job_ready_executions_scope.find(params[:job_ready_execution_id])

    set_context(job_ready_execution: @job_ready_execution)
    add_breadcrumb(
      text: @job_ready_execution,
      path: [*nested, @job_ready_execution].uniq
    )
  end

  def load_job_failed_execution
    return if params[:job_failed_execution_id].blank?

    @job_failed_execution =
      job_failed_executions_scope.find(params[:job_failed_execution_id])

    set_context(job_failed_execution: @job_failed_execution)
    add_breadcrumb(
      text: @job_failed_execution,
      path: [*nested, @job_failed_execution].uniq
    )
  end

  def load_job_scheduled_execution
    return if params[:job_scheduled_execution_id].blank?

    @job_scheduled_execution =
      job_scheduled_executions_scope.find(params[:job_scheduled_execution_id])

    set_context(job_scheduled_execution: @job_scheduled_execution)
    add_breadcrumb(
      text: @job_scheduled_execution,
      path: [*nested, @job_scheduled_execution].uniq
    )
  end

  def load_job_blocked_execution
    return if params[:job_blocked_execution_id].blank?

    @job_blocked_execution =
      job_blocked_executions_scope.find(params[:job_blocked_execution_id])

    set_context(job_blocked_execution: @job_blocked_execution)
    add_breadcrumb(
      text: @job_blocked_execution,
      path: [*nested, @job_blocked_execution].uniq
    )
  end

  def load_job_claimed_execution
    return if params[:job_claimed_execution_id].blank?

    @job_claimed_execution =
      job_claimed_executions_scope.find(params[:job_claimed_execution_id])

    set_context(job_claimed_execution: @job_claimed_execution)
    add_breadcrumb(
      text: @job_claimed_execution,
      path: [*nested, @job_claimed_execution].uniq
    )
  end

  def load_job_recurring_execution
    return if params[:job_recurring_execution_id].blank?

    @job_recurring_execution =
      job_recurring_executions_scope.find(params[:job_recurring_execution_id])

    set_context(job_recurring_execution: @job_recurring_execution)
    add_breadcrumb(
      text: @job_recurring_execution,
      path: [*nested, @job_recurring_execution].uniq
    )
  end

  def load_job_recurring_task
    return if params[:job_recurring_task_id].blank?

    @job_recurring_task =
      job_recurring_tasks_scope.find(params[:job_recurring_task_id])

    set_context(job_recurring_task: @job_recurring_task)
    add_breadcrumb(
      text: @job_recurring_task,
      path: [*nested, @job_recurring_task].uniq
    )
  end

  def load_error
    return if params[:error_id].blank?

    @error = errors_scope.find(params[:error_id])

    set_context(error: @error)
    add_breadcrumb(text: @error, path: [*nested, @error].uniq)
  end

  def load_error_occurrence
    return if params[:error_occurrence_id].blank?

    @error_occurrence =
      error_occurrences_scope.find(params[:error_occurrence_id])

    set_context(error_occurrence: @error_occurrence)
    add_breadcrumb(
      text: @error_occurrence,
      path: [*nested, @error_occurrence].uniq
    )
  end

  def load_address
    return if params[:address_id].blank?

    @address = addresses_scope.find(params[:address_id])

    set_context(address: @address)
    add_breadcrumb(text: @address, path: [*nested, @address].uniq)
  end

  def load_configuration
    return if params[:configuration_id].blank?

    @configuration =
      configurations_scope.find_by!(name: params[:configuration_id])

    set_context(configuration: @configuration)
    add_breadcrumb(text: @configuration, path: [*nested, @configuration].uniq)
  end

  def load_country_code_ip_address
    return if params[:country_code_ip_address_id].blank?

    @country_code_ip_address =
      country_code_ip_addresses_scope.find(params[:country_code_ip_address_id])

    set_context(country_code_ip_address: @country_code_ip_address)
    add_breadcrumb(
      text: @country_code_ip_address,
      path: [*nested, @country_code_ip_address].uniq
    )
  end

  def load_datum
    return if params[:datum_id].blank?

    @datum = data_scope.find(params[:datum_id])

    set_context(datum: @datum)
    add_breadcrumb(text: @datum, path: [*nested, @datum].uniq)
  end

  def load_device
    return if params[:device_id].blank?

    @device = devices_scope.find(params[:device_id])

    set_context(device: @device)
    add_breadcrumb(text: @device, path: [*nested, @device].uniq)
  end

  def load_email_address
    return if params[:email_address_id].blank?

    @email_address = email_addresses_scope.find(params[:email_address_id])

    set_context(email_address: @email_address)
    add_breadcrumb(text: @email_address, path: [*nested, @email_address].uniq)
  end

  def load_example
    return if params[:example_id].blank?

    @example = examples_scope.find(params[:example_id])

    set_context(example: @example)
    add_breadcrumb(text: @example, path: [*nested, @example].uniq)
  end

  def load_example_schedule
    return if params[:example_schedule_id].blank?

    @example_schedule =
      example_schedules_scope.find(params[:example_schedule_id])

    set_context(example_schedule: @example_schedule)
    add_breadcrumb(
      text: @example_schedule,
      path: [*nested, @example_schedule].uniq
    )
  end

  def load_handle
    return if params[:handle_id].blank?

    @handle = handles_scope.find(params[:handle_id])

    set_context(handle: @handle)
    add_breadcrumb(text: @handle, path: [*nested, @handle].uniq)
  end

  def load_parent_log
    return if params[:log_id].blank?

    @parent_log = authorize(scope.find(params[:log_id]))

    set_context(log: @parent_log)
    add_breadcrumb(text: @parent_log, path: [*nested, @parent_log].uniq)
  end

  def load_message
    return if params[:message_id].blank?

    @message = messages_scope.find(params[:message_id])

    set_context(message: @message)
    add_breadcrumb(text: @message, path: [*nested, @message].uniq)
  end

  def load_name
    return if params[:name_id].blank?

    @name = names_scope.find(params[:name_id])

    set_context(name: @name)
    add_breadcrumb(text: @name, path: [*nested, @name].uniq)
  end

  def load_password
    return if params[:password_id].blank?

    @password = passwords_scope.find(params[:password_id])

    set_context(password: @password)
    add_breadcrumb(text: @password, path: [*nested, @password].uniq)
  end

  def load_phone_number
    return if params[:phone_number_id].blank?

    @phone_number = phone_numbers_scope.find(params[:phone_number_id])

    set_context(phone_number: @phone_number)
    add_breadcrumb(text: @phone_number, path: [*nested, @phone_number].uniq)
  end

  def load_session
    return if params[:session_id].blank?

    @session = sessions_scope.find(params[:session_id])

    set_context(session: @session)
    add_breadcrumb(text: @session, path: [*nested, @session].uniq)
  end

  def load_time_zone
    return if params[:time_zone_id].blank?

    @time_zone = time_zones_scope.find(params[:time_zone_id])

    set_context(time_zone: @time_zone)
    add_breadcrumb(text: @time_zone, path: [*nested, @time_zone].uniq)
  end

  def load_token
    return if params[:token_id].blank?

    @token = tokens_scope.find(params[:token_id])

    set_context(token: @token)
    add_breadcrumb(text: @token, path: [*nested, @token].uniq)
  end

  def load_version
    return if params[:version_id].blank?

    @version = versions_scope.find(params[:version_id])

    set_context(version: @version)
    add_breadcrumb(text: @version, path: [*nested, @version].uniq)
  end

  def load_log
    @log = authorize(scope.find(id))
    set_context(log: @log)
    add_breadcrumb(text: @log, path: show_url)
  end

  def id
    params[:id].presence || params[:log_id]
  end

  def scope
    scope = searched_policy_scope(Log)

    if @version
      scope = scope.where_version(@version)
    elsif @parent_log
      scope = scope.where_log(@parent_log)
    elsif @message
      scope = scope.where_message(@message)
    elsif @name
      scope = scope.where_name(@name)
    elsif @password
      scope = scope.where_password(@password)
    elsif @phone_number
      scope = scope.where_phone_number(@phone_number)
    elsif @token
      scope = scope.where_token(@token)
    elsif @time_zone
      scope = scope.where_time_zone(@time_zone)
    elsif @session
      scope = scope.where_session(@session)
    elsif @handle
      scope = scope.where_handle(@handle)
    elsif @example_schedule
      scope = scope.where_example_schedule(@example_schedule)
    elsif @example
      scope = scope.where_example(@example)
    elsif @email_address
      scope = scope.where_email_address(@email_address)
    elsif @device
      scope = scope.where_device(@device)
    elsif @datum
      scope = scope.where_datum(@datum)
    elsif @country_code_ip_address
      scope = scope.where_country_code_ip_address(@country_code_ip_address)
    elsif @configuration
      scope = scope.where_configuration(@configuration)
    elsif @address
      scope = scope.where_address(@address)
    elsif @job_context
      scope = scope.where_job_context(@job_context)
    elsif @job_process
      scope = scope.where_job_process(@job_process)
    elsif @job_pause
      scope = scope.where_job_pause(@job_pause)
    elsif @job_semaphore
      scope = scope.where_job_semaphore(@job_semaphore)
    elsif @job_ready_execution
      scope = scope.where_job_ready_execution(@job_ready_execution)
    elsif @job_failed_execution
      scope = scope.where_job_failed_execution(@job_failed_execution)
    elsif @job_scheduled_execution
      scope = scope.where_job_scheduled_execution(@job_scheduled_execution)
    elsif @job_blocked_execution
      scope = scope.where_job_blocked_execution(@job_blocked_execution)
    elsif @job_claimed_execution
      scope = scope.where_job_claimed_execution(@job_claimed_execution)
    elsif @job_recurring_execution
      scope = scope.where_job_recurring_execution(@job_recurring_execution)
    elsif @job_recurring_task
      scope = scope.where_job_recurring_task(@job_recurring_task)
    elsif @job
      scope = scope.where_job(@job)
    elsif @program_prompt_schedule
      scope = scope.where_program_prompt_schedule(@program_prompt_schedule)
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
    elsif @program_execution
      scope = scope.where_program_execution(@program_execution)
    elsif @program_schedule
      scope = scope.where_program_schedule(@program_schedule)
    elsif @program
      scope = scope.where_program(@program)
    elsif @error_occurrence
      scope = scope.where_error_occurrence(@error_occurrence)
    elsif @error
      scope = scope.where_error(@error)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def logs_scope
    scope = policy_scope(Log)

    scope.where_log(@log) if @log

    scope
  end

  def model_class
    Log
  end

  def model_instance
    @log
  end

  def nested(
    user: @user,
    guest: @guest,
    program: @program,
    program_prompt: @program_prompt,
    program_prompt_schedule: @program_prompt_schedule,
    program_execution: @program_execution,
    program_schedule: @program_schedule,
    job: @job,
    job_context: @job_context,
    job_process: @job_process,
    job_pause: @job_pause,
    job_semaphore: @job_semaphore,
    job_ready_execution: @job_ready_execution,
    job_failed_execution: @job_failed_execution,
    job_scheduled_execution: @job_scheduled_execution,
    job_blocked_execution: @job_blocked_execution,
    job_claimed_execution: @job_claimed_execution,
    job_recurring_execution: @job_recurring_execution,
    job_recurring_task: @job_recurring_task,
    error: @error,
    error_occurrence: @error_occurrence,
    address: @address,
    configuration: @configuration,
    country_code_ip_address: @country_code_ip_address,
    datum: @datum,
    device: @device,
    email_address: @email_address,
    example: @example,
    example_schedule: @example_schedule,
    handle: @handle,
    parent_log: @parent_log,
    message: @message,
    name: @name,
    password: @password,
    phone_number: @phone_number,
    session: @session,
    time_zone: @time_zone,
    token: @token,
    version: @version
  )
    chain = []
    chain << user if user
    chain << guest if guest && !user

    job_leaf =
      job_context || job_process || job_pause || job_semaphore ||
        job_ready_execution || job_failed_execution ||
        job_scheduled_execution || job_blocked_execution ||
        job_claimed_execution || job_recurring_execution || job_recurring_task

    if program || program_prompt || program_prompt_schedule ||
         program_execution || program_schedule
      chain << program if program

      if program_prompt_schedule
        chain << program_prompt if program_prompt
        chain << program_prompt_schedule
      elsif program_prompt
        chain << program_prompt
      elsif program_execution
        chain << program_execution
      elsif program_schedule
        chain << program_schedule
      end

      chain << job if job
      chain << job_leaf if job_leaf
      chain << error if error
      chain << error_occurrence if error_occurrence
      chain << version if version
      return chain
    end

    if job || job_leaf
      chain << job if job
      chain << job_leaf if job_leaf
      chain << error if error
      chain << error_occurrence if error_occurrence
      chain << version if version
      return chain
    end

    if example_schedule
      chain << example if example
      chain << example_schedule
    elsif example
      chain << example
    elsif address
      chain << address
    elsif configuration
      chain << configuration
    elsif country_code_ip_address
      chain << country_code_ip_address
    elsif datum
      chain << datum
    elsif device
      chain << device
    elsif email_address
      chain << email_address
    elsif handle
      chain << handle
    elsif parent_log
      chain << parent_log
    elsif message
      chain << message
    elsif name
      chain << name
    elsif password
      chain << password
    elsif phone_number
      chain << phone_number
    elsif session
      chain << session
    elsif time_zone
      chain << time_zone
    elsif token
      chain << token
    elsif error || error_occurrence
      chain << error if error
      chain << error_occurrence if error_occurrence
    end

    chain << error if error && !chain.include?(error)
    if error_occurrence && !chain.include?(error_occurrence)
      chain << error_occurrence
    end
    chain << version if version
    chain
  end

  def filters
    []
  end

  def log_params
    admin? ? params.expect(log: %i[message context]) : {}
  end

  def addresses_scope
    scope = policy_scope(Address)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def configurations_scope
    policy_scope(Configuration)
  end

  def country_code_ip_addresses_scope
    policy_scope(CountryCodeIpAddress)
  end

  def data_scope
    scope = policy_scope(Datum)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def devices_scope
    scope = policy_scope(Device)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def email_addresses_scope
    scope = policy_scope(EmailAddress)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def errors_scope
    scope = policy_scope(Error)

    if @program_prompt_schedule
      scope = scope.where_program_prompt_schedule(@program_prompt_schedule)
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
    elsif @program_schedule
      scope = scope.where_program_schedule(@program_schedule)
    elsif @program
      scope = scope.where_program(@program)
    elsif @address
      scope = scope.where_address(@address)
    elsif @datum
      scope = scope.where_datum(@datum)
    elsif @device
      scope = scope.where_device(@device)
    elsif @email_address
      scope = scope.where_email_address(@email_address)
    elsif @handle
      scope = scope.where_handle(@handle)
    elsif @job
      scope = scope.where_job(@job)
    elsif @message
      scope = scope.where_message(@message)
    elsif @name
      scope = scope.where_name(@name)
    elsif @phone_number
      scope = scope.where_phone_number(@phone_number)
    elsif @time_zone
      scope = scope.where_time_zone(@time_zone)
    elsif @token
      scope = scope.where_token(@token)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def error_occurrences_scope
    scope = policy_scope(ErrorOccurrence)

    if @error
      scope = scope.where_error(@error)
    elsif @program_prompt_schedule
      scope = scope.where_program_prompt_schedule(@program_prompt_schedule)
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
    elsif @program_schedule
      scope = scope.where_program_schedule(@program_schedule)
    elsif @program
      scope = scope.where_program(@program)
    elsif @address
      scope = scope.where_address(@address)
    elsif @datum
      scope = scope.where_datum(@datum)
    elsif @device
      scope = scope.where_device(@device)
    elsif @email_address
      scope = scope.where_email_address(@email_address)
    elsif @handle
      scope = scope.where_handle(@handle)
    elsif @message
      scope = scope.where_message(@message)
    elsif @name
      scope = scope.where_name(@name)
    elsif @phone_number
      scope = scope.where_phone_number(@phone_number)
    elsif @time_zone
      scope = scope.where_time_zone(@time_zone)
    elsif @token
      scope = scope.where_token(@token)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def examples_scope
    policy_scope(Example)
  end

  def example_schedules_scope
    scope = policy_scope(ExampleSchedule)

    scope = scope.where_example(@example) if @example

    scope
  end

  def handles_scope
    scope = policy_scope(Handle)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def guests_scope
    policy_scope(Guest)
  end

  def jobs_scope
    scope = policy_scope(Job)

    if @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def job_contexts_scope
    scope = policy_scope(JobContext)

    if @job
      scope = scope.where_job(@job)
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
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
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
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
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
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
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
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
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
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
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
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
    elsif @program_prompt
      scope = scope.where_program_prompt(@program_prompt)
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

  def messages_scope
    scope = policy_scope(Message)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def names_scope
    scope = policy_scope(Name)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def passwords_scope
    scope = policy_scope(Password)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def phone_numbers_scope
    scope = policy_scope(PhoneNumber)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def program_executions_scope
    scope = policy_scope(ProgramExecution)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program

    scope
  end

  def program_prompts_scope
    scope = policy_scope(ProgramPrompt)

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
    scope = scope.where_program_prompt(@program_prompt) if @program_prompt

    scope
  end

  def program_schedules_scope
    scope = policy_scope(ProgramSchedule)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program

    scope
  end

  def programs_scope
    scope = policy_scope(Program)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def sessions_scope
    scope = policy_scope(Session)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def time_zones_scope
    scope = policy_scope(TimeZone)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def tokens_scope
    scope = policy_scope(Token)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def users_scope
    policy_scope(User)
  end

  def versions_scope
    scope = policy_scope(Version)

    scope = scope.where_log(@log) if @log

    scope
  end
end
