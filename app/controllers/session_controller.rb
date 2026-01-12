# frozen_string_literal: true

class SessionController < ApplicationController
  skip_after_action(:verify_policy_scoped)
  skip_after_action(:verify_authorized)

  helper_method(:email_address_param)
  helper_method(:password_param)

  def new
    add_breadcrumb
  end

  def create
    add_breadcrumb

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
      render(status: :unprocessable_content)
    elsif @user.nil?
      flash.now.alert = t(".wrong_password")
      render(status: :unprocessable_content)
    else
      log_in(@user)
      redirect_to(@user, notice: t(".notice"))
    end
  end

  def destroy
    log_out(Current.user)
    redirect_to(root_path, notice: t(".notice"))
  end

  def delete
    log_out(Current.user)
    redirect_to(root_path, notice: t(".notice"))
  end

  def email_address_param
    params.dig(:session, :email_address)
  end

  def password_param
    params.dig(:session, :password)
  end
end
