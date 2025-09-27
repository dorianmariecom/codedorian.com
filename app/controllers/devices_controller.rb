# frozen_string_literal: true

class DevicesController < ApplicationController
  before_action(:load_user)
  before_action(:load_device, only: %i[show edit update destroy])
  before_action(:current_user!, only: :create)
  skip_before_action(:verify_captcha, only: :create)

  def index
    authorize(Device)

    @devices = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @device =
      authorize(scope.new(user: @user, primary: user_or_guest.devices.none?))
  end

  def edit
  end

  def create
    @device = authorize(scope.new(device_params))

    if @device.save
      log_in(@device.user)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json { render(json: { message: t(".notice") }) }
      end
    else
      respond_to do |format|
        format.html do
          flash.now.alert = @device.alert
          render(:new, status: :unprocessable_entity)
        end
        format.json do
          render(
            json: {
              message: @device.alert
            },
            status: :unprocessable_entity
          )
        end
      end
    end
  end

  def update
    if @device.update(device_params)
      log_in(@device.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @device.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @device.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Device)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Device)

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
    scope = searched_policy_scope(Device)
    scope = scope.where(user: @user) if @user
    scope
  end

  def model_class
    Device
  end

  def model_instance
    @device
  end

  def nested
    [@user]
  end

  def id
    params[:device_id].presence || params[:id]
  end

  def load_device
    @device = authorize(scope.find(id))
    set_error_context(device: @device)
  end

  def device_params
    if admin?
      params.expect(device: %i[user_id platform token primary verified])
    else
      params.expect(device: %i[platform token primary])
    end
  end
end
