# frozen_string_literal: true

class EmailAddressesController < ApplicationController
  before_action :load_user
  before_action :load_email_address, only: %i[show edit update destroy]

  helper_method :id
  helper_method :url
  helper_method :new_url

  def index
    authorize EmailAddress

    @email_addresses = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @email_address =
      authorize scope.new(
                  user: @user,
                  primary: user_or_guest.email_addresses.none?
                )
  end

  def edit
  end

  def create
    @email_address = authorize scope.new(email_address_params)

    if @email_address.save
      log_in(@email_address.user)
      redirect_to @email_address, notice: t(".notice")
    else
      flash.now.alert = @email_address.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @email_address.update(email_address_params)
      log_in(@email_address.user)
      redirect_to @email_address, notice: t(".notice")
    else
      flash.now.alert = @email_address.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @email_address.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize EmailAddress

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

  def user_or_guest
    @user || Guest.new
  end

  def scope
    if @user
      policy_scope(EmailAddress).where(user: @user)
    else
      policy_scope(EmailAddress)
    end
  end

  def id
    params[:email_address_id].presence || params[:id]
  end

  def url
    [@user, :email_addresses]
  end

  def new_url
    [:new, @user, :email_address]
  end

  def load_email_address
    @email_address = authorize scope.find(id)
  end

  def email_address_params
    if admin?
      params.expect(email_address: %i[user_id verified primary email_address])
    else
      params.expect(email_address: %i[primary email_address])
    end
  end
end
