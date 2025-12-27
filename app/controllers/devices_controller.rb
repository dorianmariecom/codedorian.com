# frozen_string_literal: true

class DevicesController < ApplicationController
  before_action(:load_user)
  before_action { add_breadcrumb(key: "devices.index", path: index_url) }
  before_action(:load_device, only: %i[show edit update destroy])
  before_action(:current_user!, only: :create)
  skip_before_action(:verify_captcha, only: :create)

  def index
    authorize(Device)

    @devices = scope.page(params[:page]).order(created_at: :asc).to_a
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
    if @device.update(device_params)
      log_in(@device.user)
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
    return if params[:user_id].blank?

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
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    Device
  end

  def model_instance
    @device
  end

  def nested(user: @user)
    [user]
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
