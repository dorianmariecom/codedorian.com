# frozen_string_literal: true

class VersionsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_program_prompt)
  before_action(:load_program_prompt_schedule)
  before_action(:load_program_execution)
  before_action(:load_program_schedule)
  before_action(:load_job_context)
  before_action(:load_address)
  before_action(:load_configuration)
  before_action(:load_country_code_ip_address)
  before_action(:load_datum)
  before_action(:load_device)
  before_action(:load_email_address)
  before_action(:load_example)
  before_action(:load_example_schedule)
  before_action(:load_handle)
  before_action(:load_message)
  before_action(:load_name)
  before_action(:load_password)
  before_action(:load_phone_number)
  before_action(:load_time_zone)
  before_action(:load_token)
  before_action { add_breadcrumb(key: "versions.index", path: index_url) }
  before_action(:load_version, only: %i[show edit update destroy delete])

  def index
    authorize(Version)

    @versions = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def new
    @version = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @version = authorize(scope.new(version_params))

    if @version.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @version.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @version.assign_attributes(version_params)

    if @version.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @version.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @version.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @version.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(Version)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Version)

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

  def load_job_context
    return if params[:job_context_id].blank?

    @job_context = job_contexts_scope.find(params[:job_context_id])

    set_context(job_context: @job_context)
    add_breadcrumb(text: @job_context, path: [*nested, @job_context].uniq)
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
    @version = authorize(scope.find(id))
    set_context(version: @version)
    add_breadcrumb(text: @version, path: show_url)
  end

  def id
    params[:version_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(Version)

    if @message
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
    elsif @program_schedule
      scope = scope.where_program_schedule(@program_schedule)
    elsif @program_execution
      scope = scope.where_program_execution(@program_execution)
    elsif @program_prompt_schedule
      scope = scope.where_program_prompt_schedule(@program_prompt_schedule)
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

  def model_class
    Version
  end

  def model_instance
    @version
  end

  def nested(
    user: @user,
    guest: @guest,
    program: @program,
    program_prompt: @program_prompt,
    program_prompt_schedule: @program_prompt_schedule,
    program_execution: @program_execution,
    program_schedule: @program_schedule,
    job_context: @job_context,
    address: @address,
    configuration: @configuration,
    country_code_ip_address: @country_code_ip_address,
    datum: @datum,
    device: @device,
    email_address: @email_address,
    example: @example,
    example_schedule: @example_schedule,
    handle: @handle,
    message: @message,
    name: @name,
    password: @password,
    phone_number: @phone_number,
    time_zone: @time_zone,
    token: @token
  )
    chain = []
    chain << user if user
    chain << guest if guest && !user

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

      chain << job_context if job_context
      return chain
    end

    if job_context
      chain << job_context
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
    elsif message
      chain << message
    elsif name
      chain << name
    elsif password
      chain << password
    elsif phone_number
      chain << phone_number
    elsif time_zone
      chain << time_zone
    elsif token
      chain << token
    end

    chain
  end

  def filters
    %i[
      user
      program
      program_prompt
      program_prompt_schedule
      program_execution
      program_schedule
    ]
  end

  def version_params
    if admin?
      params.expect(
        version: %i[event item_type item_id object object_changes whodunnit]
      )
    else
      {}
    end
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

  def job_contexts_scope
    scope = policy_scope(JobContext)

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
end
