# frozen_string_literal: true

class VersionsController < ApplicationController
  before_action :load_link
  before_action :load_log
  before_action :load_page
  before_action :load_plan
  before_action :load_plan_field
  before_action :load_plan_schedule
  before_action :load_service
  before_action :load_service_field
  before_action :load_step
  before_action :load_step_execution
  before_action :load_stripe_event
  before_action :load_stripe_invoice
  before_action :load_subscription
  before_action :load_subscription_execution
  before_action :load_subscription_value
  before_action(:load_delivery)
  before_action(:load_delivery_channel)
  before_action(:load_connection)
  before_action(:load_delivery_destination)
  before_action(:load_subscription_destination)
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_program_execution)
  before_action(:load_program_schedule)
  before_action(:load_job_context)
  before_action(:load_address)
  before_action(:load_configuration)
  before_action(:load_country)
  before_action(:load_country_code_ip_address)
  before_action(:load_datum)
  before_action(:load_device)
  before_action(:load_email_address)
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

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @versions })
      end
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @version })
      end
    end
  end

  def new
    @version = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @version })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @version })
      end
    end
  end

  def create
    @version = authorize(scope.new(version_params))
    persist(:new, t(".notice"))
  end

  def update
    @version.assign_attributes(version_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @version.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @version.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(Version)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(Version)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_link
    return if params[:link_id].blank?

    @link = policy_scope(Link).find(params.expect(:link_id))
    set_context(link: @link)
    add_breadcrumb(text: @link, path: @link)
  end

  def load_log
    return if params[:log_id].blank?

    @log = policy_scope(Log).find(params.expect(:log_id))
    set_context(log: @log)
    add_breadcrumb(text: @log, path: @log)
  end

  def load_page
    return if params[:page_id].blank?

    @page = policy_scope(Page).find(params.expect(:page_id))
    set_context(page: @page)
    add_breadcrumb(text: @page, path: @page)
  end

  def load_plan
    return if params[:plan_id].blank?

    @plan = policy_scope(Plan).find(params.expect(:plan_id))
    set_context(plan: @plan)
    add_breadcrumb(text: @plan, path: @plan)
  end

  def load_plan_field
    return if params[:plan_field_id].blank?

    @plan_field = policy_scope(PlanField).find(params.expect(:plan_field_id))
    set_context(plan_field: @plan_field)
    add_breadcrumb(text: @plan_field, path: @plan_field)
  end

  def load_plan_schedule
    return if params[:plan_schedule_id].blank?

    @plan_schedule =
      policy_scope(PlanSchedule).find(params.expect(:plan_schedule_id))
    set_context(plan_schedule: @plan_schedule)
    add_breadcrumb(text: @plan_schedule, path: @plan_schedule)
  end

  def load_service
    return if params[:service_id].blank?

    @service = policy_scope(Service).find(params.expect(:service_id))
    set_context(service: @service)
    add_breadcrumb(text: @service, path: @service)
  end

  def load_service_field
    return if params[:service_field_id].blank?

    @service_field =
      policy_scope(ServiceField).find(params.expect(:service_field_id))
    set_context(service_field: @service_field)
    add_breadcrumb(text: @service_field, path: @service_field)
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

  def load_stripe_event
    return if params[:stripe_event_id].blank?

    @stripe_event =
      policy_scope(StripeEvent).find(params.expect(:stripe_event_id))
    set_context(stripe_event: @stripe_event)
    add_breadcrumb(text: @stripe_event, path: @stripe_event)
  end

  def load_stripe_invoice
    return if params[:stripe_invoice_id].blank?

    @stripe_invoice =
      policy_scope(StripeInvoice).find(params.expect(:stripe_invoice_id))
    set_context(stripe_invoice: @stripe_invoice)
    add_breadcrumb(text: @stripe_invoice, path: @stripe_invoice)
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

  def load_subscription_value
    return if params[:subscription_value_id].blank?

    @subscription_value =
      policy_scope(SubscriptionValue).find(
        params.expect(:subscription_value_id)
      )
    set_context(subscription_value: @subscription_value)
    add_breadcrumb(text: @subscription_value, path: @subscription_value)
  end

  def parent_params
    {
      link_id: @link&.id,
      log_id: @log&.id,
      page_id: @page&.id,
      plan_id: @plan&.id,
      plan_field_id: @plan_field&.id,
      plan_schedule_id: @plan_schedule&.id,
      service_id: @service&.id,
      service_field_id: @service_field&.id,
      step_id: @step&.id,
      step_execution_id: @step_execution&.id,
      stripe_event_id: @stripe_event&.id,
      stripe_invoice_id: @stripe_invoice&.id,
      subscription_id: @subscription&.id,
      subscription_execution_id: @subscription_execution&.id,
      subscription_value_id: @subscription_value&.id
    }.compact
  end

  def load_delivery
    return if params[:delivery_id].blank?

    @delivery =
      authorize(
        policy_scope(Delivery).find(params.expect(:delivery_id)),
        :show?
      )
    set_context(delivery: @delivery)
    add_breadcrumb(text: @delivery, path: @delivery)
  end

  def load_delivery_channel
    return if params[:delivery_channel_id].blank?

    @delivery_channel =
      authorize(
        policy_scope(DeliveryChannel).find(params.expect(:delivery_channel_id)),
        :show?
      )
    set_context(delivery_channel: @delivery_channel)
    add_breadcrumb(text: @delivery_channel, path: @delivery_channel)
  end

  def load_connection
    return if params[:connection_id].blank?

    @connection =
      authorize(
        policy_scope(Connection).find(params.expect(:connection_id)),
        :show?
      )
    set_context(connection: @connection)
    add_breadcrumb(text: @connection, path: @connection)
  end

  def load_delivery_destination
    return if params[:delivery_destination_id].blank?

    @delivery_destination =
      authorize(
        policy_scope(DeliveryDestination).find(
          params.expect(:delivery_destination_id)
        ),
        :show?
      )
    set_context(delivery_destination: @delivery_destination)
    add_breadcrumb(text: @delivery_destination, path: @delivery_destination)
  end

  def load_subscription_destination
    return if params[:subscription_destination_id].blank?

    @subscription_destination =
      authorize(
        policy_scope(SubscriptionDestination).find(
          params.expect(:subscription_destination_id)
        ),
        :show?
      )
    set_context(subscription_destination: @subscription_destination)
    add_breadcrumb(
      text: @subscription_destination,
      path: @subscription_destination
    )
  end

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        guests_scope.find(current_guest&.id)
      else
        guests_scope.find(params.expect(:guest_id))
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
        users_scope.find(params.expect(:user_id))
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

  def load_program_execution
    return if params[:program_execution_id].blank?

    @program_execution =
      program_executions_scope.find(params.expect(:program_execution_id))

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
      program_schedules_scope.find(params.expect(:program_schedule_id))

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

    @job_context = job_contexts_scope.find(params.expect(:job_context_id))

    set_context(job_context: @job_context)
    add_breadcrumb(text: @job_context, path: [*nested, @job_context].uniq)
  end

  def load_address
    return if params[:address_id].blank?

    @address = addresses_scope.find(params.expect(:address_id))

    set_context(address: @address)
    add_breadcrumb(text: @address, path: [*nested, @address].uniq)
  end

  def load_configuration
    return if params[:configuration_id].blank?

    @configuration =
      configurations_scope.find_by!(name: params.expect(:configuration_id))

    set_context(configuration: @configuration)
    add_breadcrumb(text: @configuration, path: [*nested, @configuration].uniq)
  end

  def load_country_code_ip_address
    return if params[:country_code_ip_address_id].blank?

    @country_code_ip_address =
      country_code_ip_addresses_scope.find(
        params.expect(:country_code_ip_address_id)
      )

    set_context(country_code_ip_address: @country_code_ip_address)
    add_breadcrumb(
      text: @country_code_ip_address,
      path: [*nested, @country_code_ip_address].uniq
    )
  end

  def load_datum
    return if params[:datum_id].blank?

    @datum = data_scope.find(params.expect(:datum_id))

    set_context(datum: @datum)
    add_breadcrumb(text: @datum, path: [*nested, @datum].uniq)
  end

  def load_device
    return if params[:device_id].blank?

    @device = devices_scope.find(params.expect(:device_id))

    set_context(device: @device)
    add_breadcrumb(text: @device, path: [*nested, @device].uniq)
  end

  def load_email_address
    return if params[:email_address_id].blank?

    @email_address =
      email_addresses_scope.find(params.expect(:email_address_id))

    set_context(email_address: @email_address)
    add_breadcrumb(text: @email_address, path: [*nested, @email_address].uniq)
  end

  def load_handle
    return if params[:handle_id].blank?

    @handle = handles_scope.find(params.expect(:handle_id))

    set_context(handle: @handle)
    add_breadcrumb(text: @handle, path: [*nested, @handle].uniq)
  end

  def load_message
    return if params[:message_id].blank?

    @message = messages_scope.find(params.expect(:message_id))

    set_context(message: @message)
    add_breadcrumb(text: @message, path: [*nested, @message].uniq)
  end

  def load_name
    return if params[:name_id].blank?

    @name = names_scope.find(params.expect(:name_id))

    set_context(name: @name)
    add_breadcrumb(text: @name, path: [*nested, @name].uniq)
  end

  def load_password
    return if params[:password_id].blank?

    @password = passwords_scope.find(params.expect(:password_id))

    set_context(password: @password)
    add_breadcrumb(text: @password, path: [*nested, @password].uniq)
  end

  def load_phone_number
    return if params[:phone_number_id].blank?

    @phone_number = phone_numbers_scope.find(params.expect(:phone_number_id))

    set_context(phone_number: @phone_number)
    add_breadcrumb(text: @phone_number, path: [*nested, @phone_number].uniq)
  end

  def load_time_zone
    return if params[:time_zone_id].blank?

    @time_zone = time_zones_scope.find(params.expect(:time_zone_id))

    set_context(time_zone: @time_zone)
    add_breadcrumb(text: @time_zone, path: [*nested, @time_zone].uniq)
  end

  def load_country
    return if params[:country_id].blank?

    @country = countries_scope.find(params.expect(:country_id))
    set_context(country: @country)
    add_breadcrumb(text: @country, path: [*nested, @country].uniq)
  end

  def load_token
    return if params[:token_id].blank?

    @token = tokens_scope.find(params.expect(:token_id))

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

    scope = scope.where_delivery(@delivery) if @delivery
    scope = scope.where_delivery_channel(@delivery_channel) if @delivery_channel
    scope = scope.where_connection(@connection) if @connection
    if @delivery_destination
      scope = scope.where_delivery_destination(@delivery_destination)
    end
    if @subscription_destination
      scope = scope.where_subscription_destination(@subscription_destination)
    end

    if @link
      scope = scope.where_link(@link)
    elsif @log
      scope = scope.where_log(@log)
    elsif @page
      scope = scope.where_page(@page)
    elsif @stripe_event
      scope = scope.where_stripe_event(@stripe_event)
    elsif @stripe_invoice
      scope = scope.where_stripe_invoice(@stripe_invoice)
    elsif @subscription_value
      scope = scope.where_subscription_value(@subscription_value)
    elsif @step_execution
      scope = scope.where_step_execution(@step_execution)
    elsif @subscription_execution
      scope = scope.where_subscription_execution(@subscription_execution)
    elsif @subscription
      scope = scope.where_subscription(@subscription)
    elsif @plan_field
      scope = scope.where_plan_field(@plan_field)
    elsif @plan_schedule
      scope = scope.where_plan_schedule(@plan_schedule)
    elsif @plan
      scope = scope.where_plan(@plan)
    elsif @service_field
      scope = scope.where_service_field(@service_field)
    elsif @step
      scope = scope.where_step(@step)
    elsif @service
      scope = scope.where_service(@service)
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
    elsif @handle
      scope = scope.where_handle(@handle)
    elsif @email_address
      scope = scope.where_email_address(@email_address)
    elsif @device
      scope = scope.where_device(@device)
    elsif @datum
      scope = scope.where_datum(@datum)
    elsif @country
      scope = scope.where_country(@country)
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
    delivery: @delivery,
    delivery_channel: @delivery_channel,
    connection: @connection,
    delivery_destination: @delivery_destination,
    subscription_destination: @subscription_destination,
    user: @user,
    guest: @guest,
    program: @program,
    program_execution: @program_execution,
    program_schedule: @program_schedule,
    job_context: @job_context,
    address: @address,
    configuration: @configuration,
    country: @country,
    country_code_ip_address: @country_code_ip_address,
    datum: @datum,
    device: @device,
    email_address: @email_address,
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
    chain << delivery if delivery
    chain << delivery_channel if delivery_channel
    chain << connection if connection
    chain << delivery_destination if delivery_destination
    chain << subscription_destination if subscription_destination

    if program || program_execution || program_schedule
      chain << program if program

      if program_execution
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

    if address
      chain << address
    elsif configuration
      chain << configuration
    elsif country_code_ip_address
      chain << country_code_ip_address
    elsif country
      chain << country
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
    %i[user program program_execution program_schedule]
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

    if @program
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

  def countries_scope
    scope = policy_scope(Country)
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
