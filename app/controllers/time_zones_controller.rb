# frozen_string_literal: true

class TimeZonesController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action { add_breadcrumb(key: "time_zones.index", path: index_url) }
  before_action(:load_time_zone, only: %i[show edit update destroy delete])

  def index
      authorize(TimeZone)

      @time_zones = scope.page(params[:page]).order(created_at: :asc)

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @time_zones
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
              data: @time_zone
            }
          )
        end
      end
  end

  def new
      @time_zone =
        authorize(scope.new(user: @user, primary: user_or_guest.time_zones.none?))

      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @time_zone
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
              data: @time_zone
            }
          )
        end
      end
  end

  def create
      @time_zone = authorize(scope.new(time_zone_params))

      if @time_zone.save(context: :controller)
        log_in(@time_zone.user)
        @user = @time_zone.user
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @time_zone
              }
            )
          end
        end
      else
        flash.now.alert = @time_zone.alert
        respond_to do |format|
          format.html { render(:new, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@time_zone.alert],
                data: @time_zone
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def update
      @time_zone.assign_attributes(time_zone_params)

      if @time_zone.save(context: :controller)
        log_in(@time_zone.user)
        @user = @time_zone.user
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @time_zone
              }
            )
          end
        end
      else
        flash.now.alert = @time_zone.alert
        respond_to do |format|
          format.html { render(:edit, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@time_zone.alert],
                data: @time_zone
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def destroy
      @time_zone.destroy!

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @time_zone

            }
          )
        end
      end
  end

  def delete
      @time_zone.delete

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @time_zone

            }
          )
        end
      end
  end

  def destroy_all
      authorize(TimeZone)

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
      authorize(TimeZone)

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
    scope = searched_policy_scope(TimeZone)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_time_zone(@time_zone) if @time_zone
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_time_zone(@time_zone) if @time_zone
    scope
  end

  def model_class
    TimeZone
  end

  def model_instance
    @time_zone
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
  end

  def id
    params[:time_zone_id].presence || params[:id]
  end

  def load_time_zone
    @time_zone = authorize(scope.find(id))
    set_context(time_zone: @time_zone)
    add_breadcrumb(text: @time_zone, path: show_url)
  end

  def time_zone_params
    if admin?
      params.expect(time_zone: %i[user_id primary verified time_zone])
    else
      params.expect(time_zone: %i[primary time_zone])
    end
  end
end
