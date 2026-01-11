# frozen_string_literal: true

class DevicesController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action { add_breadcrumb(key: "devices.index", path: index_url) }
  before_action(:load_device, only: %i[show edit update destroy delete])
  before_action(:current_user!, only: :create)
  skip_before_action(:verify_captcha, only: :create)

  rate_limit to: 100, within: 5.minutes, only: :create

  def index
    authorize(Device)

    @devices = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @device =
      authorize(scope.new(user: @user, primary: user_or_guest.devices.none?))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @device = authorize(scope.new(device_params))

    if @device.save(context: :controller)
      log_in(@device.user)
      @user = @device.user
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json { render(json: { message: t(".notice") }) }
      end
    else
      respond_to do |format|
        format.html do
          flash.now.alert = @device.alert
          render(:new, status: :unprocessable_content)
        end
        format.json do
          render(
            json: {
              message: @device.alert
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def update
    @device.assign_attributes(device_params)

    if @device.save(context: :controller)
      log_in(@device.user)
      @user = @device.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @device.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @device.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @device.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
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

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        policy_scope(Guest).find(current_guest&.id)
      else
        policy_scope(Guest).find(params[:guest_id])
      end

    set_context(guest: @guest)
    add_breadcrumb(key: "guests.index", path: :guests)
    add_breadcrumb(text: @guest, path: @guest)
  end

  def load_user
    # Don't load user for guest routes or when no user_id is provided
    return if params[:user_id].blank? || params[:guest_id].present?

    @user =
      if params[:user_id] == "me"
        policy_scope(User).find(current_user&.id)
      else
        policy_scope(User).find(params[:user_id])
      end

    set_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def user_or_guest
    @user || Guest.new
  end

  def scope
    scope = searched_policy_scope(Device)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    Device
  end

  def model_instance
    @device
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
  end

  def id
    params[:device_id].presence || params[:id]
  end

  def load_device
    @device = authorize(scope.find(id))
    set_context(device: @device)
    add_breadcrumb(text: @device, path: show_url)
  end

  def device_params
    if admin?
      params.expect(device: %i[user_id platform token primary verified])
    else
      params.expect(device: %i[platform token primary])
    end
  end
end
