# frozen_string_literal: true

class PasswordsController < ApplicationController
  before_action :load_user
  before_action :load_password, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url

  def index
    authorize Password

    @passwords = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @password = authorize scope.new
  end

  def edit
  end

  def create
    @password = authorize scope.new(password_params)

    if @password.save
      log_in(@password.user)
      redirect_to @password, notice: t(".notice")
    else
      flash.now.alert = @password.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @password.update(password_params)
      log_in(@password.user)
      redirect_to @password, notice: t(".notice")
    else
      flash.now.alert = @password.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @password.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize Password

    scope.destroy_all

    redirect_back_or_to(url)
  end

  private

  def load_user
    if params[:user_id] == "me"
      @user = policy_scope(User).find(current_user&.id)
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def scope
    @user ? policy_scope(Password).where(user: @user) : policy_scope(Password)
  end

  def url
    @user ? [@user, :passwords] : passwords_path
  end

  def new_url
    @user ? [:new, @user, :password] : new_password_path
  end

  def id
    params[:password_id].presence || params[:id]
  end

  def load_password
    @password = authorize scope.find(id)
  end

  def password_params
    if admin?
      params.expect(password: %i[user_id password hint primary verified])
    else
      params.expect(password: %i[password hint primary])
    end
  end
end
