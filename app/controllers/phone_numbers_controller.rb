# frozen_string_literal: true

class PhoneNumbersController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action { add_breadcrumb(key: "phone_numbers.index", path: index_url) }
  before_action(:load_phone_number, only: %i[show edit update destroy delete])

  def index
    authorize(PhoneNumber)

    @phone_numbers = scope.page(params[:page]).order(created_at: :asc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @phone_numbers })
      end
    end
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @phone_number })
      end
    end
  end

  def new
    @phone_number =
      authorize(
        scope.new(user: @user, primary: user_or_guest.phone_numbers.none?)
      )

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @phone_number })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @phone_number })
      end
    end
  end

  def create
    @phone_number = authorize(scope.new(phone_number_params))
    persist(:new, t(".notice")) do
      log_in(@phone_number.user)
      @user = @phone_number.user
    end
  end

  def update
    @phone_number.assign_attributes(phone_number_params)
    persist(:edit, t(".notice")) do
      log_in(@phone_number.user)
      @user = @phone_number.user
    end
  end

  def destroy
    @phone_number.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @phone_number.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(PhoneNumber)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(PhoneNumber)

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

  def user_or_guest
    @user || Guest.new
  end

  def scope
    scope = searched_policy_scope(PhoneNumber)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_phone_number(@phone_number) if @phone_number
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_phone_number(@phone_number) if @phone_number
    scope
  end

  def model_class
    PhoneNumber
  end

  def model_instance
    @phone_number
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
  end

  def id
    params[:phone_number_id].presence || params[:id]
  end

  def load_phone_number
    @phone_number = authorize(scope.find(id))
    set_context(phone_number: @phone_number)
    add_breadcrumb(text: @phone_number, path: show_url)
  end

  def phone_number_params
    if admin?
      params.expect(phone_number: %i[user_id primary verified phone_number])
    else
      params.expect(phone_number: %i[primary phone_number])
    end
  end
end
