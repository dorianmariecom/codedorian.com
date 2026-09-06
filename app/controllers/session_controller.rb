# frozen_string_literal: true

class SessionController < ApplicationController
  skip_after_action(:verify_policy_scoped)
  skip_after_action(:verify_authorized)

  helper_method(:email_address_param)
  helper_method(:password_param)

  rate_limit to: 5, within: 1.minute, only: :request_magic_link

  def new_magic_link
    add_breadcrumb
  end

  def request_magic_link
    addresses = EmailAddress.where(email_address: email_address_param).to_a
    addresses
      .uniq(&:user_id)
      .each do |address|
        url =
          magic_link_login_url(
            email_address_id: address.id,
            token: address.magic_link_token,
            redirect_to: requested_redirect_path
          )
        SessionMailer.magic_link(
          email_address: address.email_address,
          url: url
        ).deliver_later
      end

    redirect_to(new_magic_link_login_path, notice: t(".notice"))
  end

  def magic_link
    return unless load_magic_link_email_address

    add_breadcrumb
  end

  def authenticate_magic_link
    return unless load_magic_link_email_address

    user = @magic_link_email_address.user
    reset_session
    Current.user = nil
    log_in(user)
    redirect_to(
      requested_redirect_path || user,
      notice: t("session.create.notice"),
      status: :see_other
    )
  end

  def new
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json { render(json: { status: :ok, messages: [], data: nil }) }
    end
  end

  def create
    add_breadcrumb

    @users =
      User.includes(:passwords, :email_addresses).where_email_address(
        email_address_param
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
          render(json: { status: :ok, messages: [t(".notice")], data: @user })
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

  private

  def load_magic_link_email_address
    no_store
    @magic_link_email_address =
      EmailAddress.find_by_magic_link(params[:email_address_id], params[:token])
    return true if @magic_link_email_address

    redirect_to(
      new_magic_link_login_path,
      alert: t("session.magic_link.invalid"),
      status: :see_other
    )
    false
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
