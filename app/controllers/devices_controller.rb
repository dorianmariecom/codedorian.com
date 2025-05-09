# frozen_string_literal: true

class DevicesController < ApplicationController
  before_action :load_user
  before_action :load_device, only: %i[show edit update destroy]
  before_action :current_user!, only: :create
  skip_before_action :verify_captcha, only: :create

  helper_method :url
  helper_method :new_url

  def index
    authorize Device

    @devices = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @device =
      authorize scope.new(user: @user, primary: user_or_guest.devices.none?)
  end

  def edit
  end

  def create
    @device = authorize scope.new(device_params)

    if @device.save
      log_in(@device.user)
      respond_to do |format|
        format.html { redirect_to @device, notice: t(".notice") }
        format.json { render json: { message: t(".notice") } }
      end
    else
      respond_to do |format|
        format.html do
          flash.now.alert = @device.alert
          render :new, status: :unprocessable_entity
        end
        format.json do
          render json: { message: @device.alert }, status: :unprocessable_entity
        end
      end
    end
  end

  def update
    if @device.update(device_params)
      log_in(@device.user)
      redirect_to @device, notice: t(".notice")
    else
      flash.now.alert = @device.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @device.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize Device

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
    scope = searched_policy_scope(Device)
    scope = scope.where(user: @user) if @user
    scope
  end

  def url
    [@user, :devices].compact
  end

  def new_url
    [:new, @user, :device].compact
  end

  def id
    params[:device_id].presence || params[:id]
  end

  def load_device
    @device = authorize scope.find(id)
  end

  def device_params
    if admin?
      params.expect(device: %i[user_id platform token primary verified])
    else
      params.expect(device: %i[platform token primary])
    end
  end
end
