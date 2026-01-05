# frozen_string_literal: true

class PasswordsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action { add_breadcrumb(key: "passwords.index", path: index_url) }
  before_action(:load_password, only: %i[show edit update destroy])
  skip_before_action(:verify_captcha, only: :check)
  skip_after_action(:verify_policy_scoped, only: :check)

  def index
    authorize(Password)

    @passwords = scope.page(params[:page]).order(created_at: :asc)
  end

  def check
    authorize(Password)

    result = PasswordValidator.check(params[:password])
    render(json: { success: result.success?, message: result.message })
  end

  def show
  end

  def new
    @password =
      authorize(scope.new(user: @user, primary: user_or_guest.passwords.none?))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @password = authorize(scope.new(password_params))

    if @password.save
      log_in(@password.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @password.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    if @password.update(password_params)
      log_in(@password.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @password.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @password.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Password)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Password)

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

  def user_or_guest
    @user || Guest.new
  end

  def scope
    scope = searched_policy_scope(Password)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    Password
  end

  def model_instance
    @password
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
  end

  def id
    params[:password_id].presence || params[:id]
  end

  def load_password
    @password = authorize(scope.find(id))
    set_context(password: @password)
    add_breadcrumb(text: @password, path: show_url)
  end

  def password_params
    if admin?
      params.expect(password: %i[user_id password hint primary verified])
    else
      params.expect(password: %i[password hint primary])
    end
  end
end
