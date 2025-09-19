# frozen_string_literal: true

class EmailAddressesController < ApplicationController
  before_action(:load_user)
  before_action(:load_email_address, only: %i[show edit update destroy])

  def index
    authorize(EmailAddress)

    @email_addresses = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @email_address =
      authorize(
        scope.new(user: @user, primary: user_or_guest.email_addresses.none?)
      )
  end

  def edit
  end

  def create
    @email_address = authorize(scope.new(email_address_params))

    if @email_address.save
      log_in(@email_address.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @email_address.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    if @email_address.update(email_address_params)
      log_in(@email_address.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @email_address.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @email_address.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(EmailAddress)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(EmailAddress)

    scope.delete_all

    redirect_back_or_to(index_url)
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
    scope = searched_policy_scope(EmailAddress)
    scope = scope.where(user: @user) if @user
    scope
  end

  def id
    params[:email_address_id].presence || params[:id]
  end

  def model_name
    EmailAddress
  end

  def model_instance
    @email_address
  end

  def nested
    [@user]
  end

  def load_email_address
    @email_address = authorize(scope.find(id))
  end

  def email_address_params
    if admin?
      params.expect(email_address: %i[user_id verified primary email_address])
    else
      params.expect(email_address: %i[primary email_address])
    end
  end
end
