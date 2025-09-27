# frozen_string_literal: true

class AddressesController < ApplicationController
  before_action(:load_user)
  before_action(:load_address, only: %i[show edit update destroy])

  def index
    authorize(Address)

    @addresses = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @address =
      authorize(scope.new(user: @user, primary: user_or_guest.addresses.none?))
  end

  def edit
  end

  def create
    @address = authorize(scope.new(address_params))

    if @address.save(context: :controller)
      log_in(@address.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @address.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    @address.assign_attributes(address_params)

    if @address.save(context: :controller)
      log_in(@address.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @address.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @address.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Address)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Address)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  private

  def load_user
    if params[:user_id] == "me"
      @user = policy_scope(User).find(current_user&.id)
      set_error_context(user: @user)
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
      set_error_context(user: @user)
    end
  end

  def user_or_guest
    @user || Guest.new
  end

  def scope
    scope = searched_policy_scope(Address)
    scope = scope.where(user: @user) if @user
    scope
  end

  def model_class
    Address
  end

  def model_instance
    @address
  end

  def nested
    [@user]
  end

  def id
    params[:address_id].presence || params[:id]
  end

  def load_address
    @address = authorize(scope.find(id))
    set_error_context(address: @address)
  end

  def address_params
    if admin?
      params.expect(address: %i[user_id primary verified address autocomplete])
    else
      params.expect(address: %i[primary address autocomplete])
    end
  end
end
