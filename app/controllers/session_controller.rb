# frozen_string_literal: true

class SessionController < ApplicationController
  skip_after_action(:verify_policy_scoped)
  skip_after_action(:verify_authorized)

  helper_method(:email_address_param)
  helper_method(:password_param)

  def new
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: nil })
      end
    end
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
      message = t(".wrong_email_address")
      respond_to do |format|
        format.html do
          flash.now.alert = message
          render(:new, status: :unprocessable_content)
        end
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [message],
              data: nil
            },
            status: :unprocessable_content
          )
        end
      end
    elsif @user.nil?
      message = t(".wrong_password")
      respond_to do |format|
        format.html do
          flash.now.alert = message
          render(:new, status: :unprocessable_content)
        end
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [message],
              data: nil
            },
            status: :unprocessable_content
          )
        end
      end
    else
      log_in(@user)
      respond_to do |format|
        format.html do
          redirect_to(requested_redirect_path || @user, notice: t(".notice"))
        end
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @user
            }
          )
        end
      end
    end
  end

  def destroy
    log_out(Current.user)
    respond_to do |format|
      format.html { redirect_to(root_path, notice: t(".notice")) }
      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def delete
    log_out(Current.user)
    respond_to do |format|
      format.html { redirect_to(root_path, notice: t(".notice")) }
      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def email_address_param
    params.dig(:session, :email_address)
  end

  def password_param
    params.dig(:session, :password)
  end

  def requested_redirect_path
    path = params[:redirect_to].to_s
    return if path.start_with?("//")
    return unless path.start_with?("/")

    path
  end
end
