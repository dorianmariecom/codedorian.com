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

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @devices
            }
          )
        end
      end
  end

  def show
      @versions = versions_scope.order(created_at: :desc).page(params[:page])
      @logs = logs_scope.order(created_at: :desc).page(params[:page])

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @device
            }
          )
        end
      end
  end

  def new
      @device =
        authorize(scope.new(user: @user, primary: user_or_guest.devices.none?))

      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @device
            }
          )
        end
      end
  end

  def edit
      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @device
            }
          )
        end
      end
  end

  def create
      @device = authorize(scope.new(device_params))

      if @device.save(context: :controller)
        log_in(@device.user)
        @user = @device.user
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @device
              }
            )
          end
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
                status: :unprocessable_content,
                messages: [@device.alert],
                data: @device
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
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @device
              }
            )
          end
        end
      else
        flash.now.alert = @device.alert
        respond_to do |format|
          format.html { render(:edit, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@device.alert],
                data: @device
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def destroy
      @device.destroy!

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @device

            }
          )
        end
      end
  end

  def delete
      @device.delete

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @device

            }
          )
        end
      end
  end

  def destroy_all
      authorize(Device)

      scope.destroy_all

      respond_to do |format|
        format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: nil

            }
          )
        end
      end
  end

  def delete_all
      authorize(Device)

      scope.delete_all

      respond_to do |format|
        format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: nil

            }
          )
        end
      end
  end

  private

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        policy_scope(Guest).find(current_guest&.id)
      else
        policy_scope(Guest).find(params.expect(:guest_id))
      end

    set_context(guest: @guest)
    add_breadcrumb(key: "guests.index", path: :guests)
    add_breadcrumb(text: @guest, path: @guest)
  end

  def load_user
    return if params[:user_id].blank?

    @user =
      if params[:user_id] == "me"
        policy_scope(User).find(current_user&.id)
      else
        policy_scope(User).find(params.expect(:user_id))
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

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_device(@device) if @device
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_device(@device) if @device
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
