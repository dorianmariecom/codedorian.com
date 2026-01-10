# frozen_string_literal: true

class ErrorOccurrencesController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_program_schedule)
  before_action(:load_program_prompt)
  before_action(:load_program_prompt_schedule)
  before_action(:load_address)
  before_action(:load_attachment)
  before_action(:load_datum)
  before_action(:load_device)
  before_action(:load_email_address)
  before_action(:load_device)
  before_action(:load_handle)
  before_action(:load_job)
  before_action(:load_message)
  before_action(:load_name)
  before_action(:load_phone_number)
  before_action(:load_time_zone)
  before_action(:load_token)
  before_action(:load_error)
  before_action do
    add_breadcrumb(key: "error_occurrences.index", path: index_url)
  end
  before_action(:load_error_occurrence, only: %i[show destroy delete])

  def index
    authorize(ErrorOccurrence)

    @error_occurrences = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def new
    @error_occurrence = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @error_occurrence = authorize(scope.new(error_occurrence_params))

    if @error_occurrence.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @error_occurrence.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @error_occurrence.assign_attributes(error_occurrence_params)

    if @error_occurrence.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @error_occurrence.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @error_occurrence.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @error_occurrence.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(ErrorOccurrence)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(ErrorOccurrence)

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

  def load_error
    return if params[:error_id].blank?

    @error = errors_scope.find(params[:error_id])

    set_context(error: @error)
    add_breadcrumb(key: "errors.index", path: [@user, :errors])
    add_breadcrumb(text: @error, path: [@user, @error])
  end

  def load_error_occurrence
    @error_occurrence = authorize(scope.find(id))

    set_context(error_occurrence: @error_occurrence)
    add_breadcrumb(text: @error_occurrence, path: show_url)
  end

  def id
    params[:error_occurrence_id].presence || params[:id]
  end

  def model_class
    ErrorOccurrence
  end

  def model_instance
    @error_occurrence
  end

  def scope
    scope = searched_policy_scope(ErrorOccurrence)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_error(@error) if @error
    scope = scope.where_program(@program) if @program
    scope = scope.where_program_schedule(@program_schedule) if @program_schedule
    scope = scope.where_program_prompt(@program_prompt) if @program_prompt
    if @program_prompt_schedule
      scope = scope.where_program_prompt_schedule(@program_prompt_schedule)
    end
    scope = scope.where_address(@address) if @address
    scope = scope.where_attachment(@attachment) if @attachment
    scope = scope.where_datum(@datum) if @datum
    scope = scope.where_device(@device) if @device
    scope = scope.where_email_address(@email_address) if @email_address
    scope = scope.where_handle(@handle) if @handle
    scope = scope.where_job(@job) if @job
    scope = scope.where_message(@message) if @message
    scope = scope.where_name(@name) if @name
    scope = scope.where_phone_number(@phone_number) if @phone_number
    scope = scope.where_time_zone(@time_zone) if @time_zone
    scope = scope.where_token(@token) if @token
    scope
  end

  def errors_scope
    scope = searched_policy_scope(Error)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope = scope.where_program_schedule(@program_schedule) if @program_schedule
    scope = scope.where_program_prompt(@program_prompt) if @program_prompt
    if @program_prompt_schedule
      scope = scope.where_program_prompt_schedule(@program_prompt_schedule)
    end
    scope = scope.where_address(@address) if @address
    scope = scope.where_attachment(@attachment) if @attachment
    scope = scope.where_datum(@datum) if @datum
    scope = scope.where_device(@device) if @device
    scope = scope.where_email_address(@email_address) if @email_address
    scope = scope.where_handle(@handle) if @handle
    scope = scope.where_job(@job) if @job
    scope = scope.where_message(@message) if @message
    scope = scope.where_name(@name) if @name
    scope = scope.where_phone_number(@phone_number) if @phone_number
    scope = scope.where_time_zone(@time_zone) if @time_zone
    scope = scope.where_token(@token) if @token
    scope
  end

  def nested(
    user: @user,
    guest: @guest,
    program: @program,
    program_schedule: @program_schedule,
    program_prompt: @program_prompt,
    program_prompt_schedule: @program_prompt_schedule,
    address: @address,
    attachment: @attachment,
    datum: @datum,
    device: @device,
    email_address: @email_address,
    handle: @handle,
    job: @job,
    message: @message,
    name: @name,
    phone_number: @phone_number,
    time_zone: @time_zone,
    token: @token,
    error: @error
  )
    chain = []
    chain << user if user
    chain << guest if guest && !user

    if program || program_prompt || program_prompt_schedule || program_schedule
      chain << program if program

      if program_prompt_schedule
        chain << program_prompt if program_prompt
        chain << program_prompt_schedule
      elsif program_prompt
        chain << program_prompt
      elsif program_schedule
        chain << program_schedule
      end

      chain << error if error
      return chain
    end

    if address
      chain << address
    elsif attachment
      chain << attachment
    elsif datum
      chain << datum
    elsif device
      chain << device
    elsif email_address
      chain << email_address
    elsif handle
      chain << handle
    elsif job
      chain << job
    elsif message
      chain << message
    elsif name
      chain << name
    elsif phone_number
      chain << phone_number
    elsif time_zone
      chain << time_zone
    elsif token
      chain << token
    end

    chain << error if error
    chain
  end

  def filters
    %i[
      user
      error
      program
      program_prompt
      program_prompt_schedule
      program_schedule
      address
      attachment
      datum
      device
      email_address
      handle
      job
      message
      name
      phone_number
      time_zone
      token
    ]
  end

  def programs_scope
    scope = policy_scope(Program)
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

  def addresses_scope
    scope = policy_scope(Address)
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

  def jobs_scope
    scope = policy_scope(Job)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope = scope.where_program(@program) if @program
    scope = scope.where_program_prompt(@program_prompt) if @program_prompt
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

  def phone_numbers_scope
    scope = policy_scope(PhoneNumber)
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

  def load_program
    return if params[:program_id].blank?

    @program = programs_scope.find(params[:program_id])

    set_context(program: @program)
    add_breadcrumb(key: "programs.index", path: [@user, :programs])
    add_breadcrumb(text: @program, path: [@user, @program])
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

    add_breadcrumb(
      key: "program_prompt_schedules.index",
      path: [@user, @program, @program_prompt, :program_prompt_schedules]
    )
    add_breadcrumb(
      text: @program_prompt_schedule,
      path: [@user, @program, @program_prompt, @program_prompt_schedule]
    )
  end

  def load_address
    return if params[:address_id].blank?

    @address = addresses_scope.find(params[:address_id])

    set_context(address: @address)
    add_breadcrumb(key: "addresses.index", path: [@user, :addresses])
    add_breadcrumb(text: @address, path: [@user, @address])
  end

  def load_attachment
    return if params[:attachment_id].blank?

    @attachment = attachments_scope.find(params[:attachment_id])

    set_context(attachment: @attachment)
    add_breadcrumb(key: "attachments.index", path: [@user, :attachments])
    add_breadcrumb(text: @attachment, path: [@user, @attachment])
  end

  def load_datum
    return if params[:datum_id].blank?

    @datum = data_scope.find(params[:datum_id])

    set_context(datum: @datum)
    add_breadcrumb(key: "data.index", path: [@user, :data])
    add_breadcrumb(text: @datum, path: [@user, @datum])
  end

  def load_device
    return if params[:device_id].blank?

    @device = devices_scope.find(params[:device_id])

    set_context(device: @device)
    add_breadcrumb(key: "devices.index", path: [@user, :devices])
    add_breadcrumb(text: @device, path: [@user, @device])
  end

  def load_email_address
    return if params[:email_address_id].blank?

    @email_address = email_addresses_scope.find(params[:email_address_id])

    set_context(email_address: @email_address)
    add_breadcrumb(
      key: "email_addresses.index",
      path: [@user, :email_addresses]
    )
    add_breadcrumb(text: @email_address, path: [@user, @email_address])
  end

  def load_handle
    return if params[:handle_id].blank?

    @handle = handles_scope.find(params[:handle_id])

    set_context(handle: @handle)
    add_breadcrumb(key: "handles.index", path: [@user, :handles])
    add_breadcrumb(text: @handle, path: [@user, @handle])
  end

  def load_job
    return if params[:job_id].blank?

    @job = jobs_scope.find(params[:job_id])

    set_context(job: @job)
    add_breadcrumb(key: "jobs.index", path: [@user, :jobs])
    add_breadcrumb(text: @job, path: [@user, @job])
  end

  def load_message
    return if params[:message_id].blank?

    @message = messages_scope.find(params[:message_id])

    set_context(message: @message)
    add_breadcrumb(key: "messages.index", path: [@user, :messages])
    add_breadcrumb(text: @message, path: [@user, @message])
  end

  def load_name
    return if params[:name_id].blank?

    @name = names_scope.find(params[:name_id])

    set_context(name: @name)
    add_breadcrumb(key: "names.index", path: [@user, :names])
    add_breadcrumb(text: @name, path: [@user, @name])
  end

  def load_phone_number
    return if params[:phone_number_id].blank?

    @phone_number = phone_numbers_scope.find(params[:phone_number_id])

    set_context(phone_number: @phone_number)
    add_breadcrumb(key: "phone_numbers.index", path: [@user, :phone_numbers])
    add_breadcrumb(text: @phone_number, path: [@user, @phone_number])
  end

  def load_time_zone
    return if params[:time_zone_id].blank?

    @time_zone = time_zones_scope.find(params[:time_zone_id])

    set_context(time_zone: @time_zone)
    add_breadcrumb(key: "time_zones.index", path: [@user, :time_zones])
    add_breadcrumb(text: @time_zone, path: [@user, @time_zone])
  end

  def load_token
    return if params[:token_id].blank?

    @token = tokens_scope.find(params[:token_id])

    set_context(token: @token)
    add_breadcrumb(key: "tokens.index", path: [@user, :tokens])
    add_breadcrumb(text: @token, path: [@user, @token])
  end

  def error_occurrence_params
    if admin?
      params.expect(error_occurrence: %i[backtrace context error_id])
    else
      {}
    end
  end
end
