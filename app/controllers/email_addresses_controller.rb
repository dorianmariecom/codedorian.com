# frozen_string_literal: true

class EmailAddressesController < ApplicationController
  VERIFICATION_REQUEST_LIMIT = 5
  VERIFICATION_REQUEST_WINDOW = 1.minute

  before_action :current_user!, only: :request_verification
  before_action only: %i[
    request_verification
    verification
    confirm_verification
  ] do
    no_store
    set_current_locale
  end
  rate_limit to: VERIFICATION_REQUEST_LIMIT,
             within: VERIFICATION_REQUEST_WINDOW,
             only: :request_verification

  before_action(:load_guest, except: %i[verification confirm_verification])
  before_action(:load_user, except: %i[verification confirm_verification])
  before_action do
    add_breadcrumb(key: "email_addresses.index", path: index_url)
  end
  before_action(
    :load_email_address,
    only: %i[show edit update destroy delete request_verification]
  )

  def request_verification
    unless @email_address.verified?
      @email_address.request_verification!(
        url:
          verification_email_address_url(
            id: @email_address,
            token: @email_address.verification_token
          )
      )
    end
    respond_verification(
      @email_address.verified? ? :already_verified : :sent,
      path: email_address_path(@email_address)
    )
  end

  def verification
    record =
      policy_scope([:public, EmailAddress]).find_by_verification(
        params[:id],
        params[:token]
      )
    authorize([:public, record || EmailAddress])
    if record
      respond_verification(:confirmation)
    else
      respond_verification(:invalid, status: :unprocessable_content)
    end
  end

  def confirm_verification
    record =
      policy_scope([:public, EmailAddress]).find_by_verification(
        params[:id],
        params[:token]
      )
    authorize([:public, record || EmailAddress])
    if record && SharedEmailVerification.confirm(record, params[:token])
      respond_verification(:confirmed)
    else
      respond_verification(:invalid, status: :unprocessable_content)
    end
  end

  def index
    authorize(EmailAddress)

    @email_addresses = scope.page(params[:page]).order(created_at: :asc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @email_addresses })
      end
    end
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @email_address })
      end
    end
  end

  def new
    @email_address =
      authorize(
        scope.new(user: @user, primary: user_or_guest.email_addresses.none?)
      )

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @email_address })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @email_address })
      end
    end
  end

  def create
    @email_address = authorize(scope.new(email_address_params))
    persist(:new, t(".notice")) do
      log_in(@email_address.user)
      @user = @email_address.user
    end
  end

  def update
    @email_address.assign_attributes(email_address_params)
    persist(:edit, t(".notice")) do
      log_in(@email_address.user)
      @user = @email_address.user
    end
  end

  def destroy
    @email_address.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @email_address.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(EmailAddress)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(EmailAddress)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def respond_verification(key, status: :ok, path: nil)
    @message = t(".#{key}")
    @confirmation = key == :confirmation
    respond_to do |format|
      format.html do
        if path
          redirect_to(path, notice: @message)
        else
          render :verification, status: status
        end
      end
      format.json do
        render json: {
                 status: status,
                 messages: [@message],
                 data: nil
               },
               status: status
      end
    end
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

  def user_or_guest
    @user || Guest.new
  end

  def scope
    scope = searched_policy_scope(EmailAddress)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_email_address(@email_address) if @email_address
    scope
  end

  def id
    params[:email_address_id].presence || params[:id]
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_email_address(@email_address) if @email_address
    scope
  end

  def model_class
    EmailAddress
  end

  def model_instance
    @email_address
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
  end

  def load_email_address
    @email_address = authorize(scope.find(id))
    set_context(email_address: @email_address)
    add_breadcrumb(text: @email_address, path: show_url)
  end

  def email_address_params
    if admin?
      params.expect(email_address: %i[user_id verified primary email_address])
    else
      params.expect(email_address: %i[primary email_address])
    end
  end
end
