# frozen_string_literal: true

class SessionsController < ApplicationController
  before_action { authorize :session }
  skip_after_action :verify_policy_scoped

  helper_method :email_address_param
  helper_method :password_param

  def new
  end

  def create
    @users =
      User.includes(:passwords, :email_addresses).where(
        email_addresses: {
          email_address: email_address_param
        }
      )

    @user =
      @users.detect do |user|
        user.passwords.any? { |password| password.authenticate(password_param) }
      end

    if @users.none?
      flash.now.alert = t(".wrong_email_address")
      render :new, status: :unprocessable_entity
    elsif @user.nil?
      flash.now.alert = t(".wrong_password")
      render :new, status: :unprocessable_entity
    else
      log_in(@user)
      redirect_to @user, notice: t(".notice")
    end
  end

  def destroy
    reset_session
    session[:user_id] = nil

    redirect_to root_path, notice: t(".notice")
  end

  def email_address_param
    params.dig(:session, :email_address)
  end

  def password_param
    params.dig(:session, :password)
  end
end
