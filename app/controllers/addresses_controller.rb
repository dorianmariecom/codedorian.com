# frozen_string_literal: true

class AddressesController < ApplicationController
  before_action :load_user
  before_action :load_address, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url

  def index
    authorize Address

    @addresses = scope.page(params[:page])
  end

  def show
  end

  def new
    @address = authorize scope.new(primary: current_user.addresses.none?)
  end

  def edit
  end

  def create
    @address = authorize scope.new(address_params)

    if @address.save
      log_in(@address.user)
      redirect_to @address, notice: t(".notice")
    else
      flash.now.alert = @address.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @address.update(address_params)
      log_in(@address.user)
      redirect_to @address, notice: t(".notice")
    else
      flash.now.alert = @address.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @address.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize Address

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
    @user ? policy_scope(Address).where(user: @user) : policy_scope(Address)
  end

  def url
    @user ? [@user, :addresses] : addresses_path
  end

  def new_url
    @user ? [:new, @user, :address] : new_address_path
  end

  def id
    params[:address_id].presence || params[:id]
  end

  def load_address
    @address = authorize scope.find(id)
  end

  def address_params
    if admin?
      params.expect(
        address: %i[
          user_id
          primary
          verified
          address
          formatted_address
          address_components
          place_id
          types
          geometry
        ]
      )
    else
      params.expect(
        address: %i[
          primary
          address
          formatted_address
          address_components
          place_id
          types
          geometry
        ]
      )
    end
  end
end
