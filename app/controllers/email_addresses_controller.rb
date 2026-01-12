# frozen_string_literal: true

class EmailAddressesController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action do
    add_breadcrumb(key: "email_addresses.index", path: index_url)
  end
  before_action(:load_email_address, only: %i[show edit update destroy delete])

  def index
    authorize(EmailAddress)

    @email_addresses = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @email_address =
      authorize(
        scope.new(user: @user, primary: user_or_guest.email_addresses.none?)
      )

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @email_address = authorize(scope.new(email_address_params))

    if @email_address.save(context: :controller)
      log_in(@email_address.user)
      @user = @email_address.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @email_address.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @email_address.assign_attributes(email_address_params)

    if @email_address.save(context: :controller)
      log_in(@email_address.user)
      @user = @email_address.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @email_address.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @email_address.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @email_address.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(EmailAddress)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(EmailAddress)

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
