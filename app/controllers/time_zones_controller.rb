# frozen_string_literal: true

class TimeZonesController < ApplicationController
  before_action(:load_user)
  before_action { add_breadcrumb(key: "time_zones.index", path: index_url) }
  before_action(:load_time_zone, only: %i[show edit update destroy])

  def index
    authorize(TimeZone)

    @time_zones = scope.page(params[:page]).order(created_at: :asc).to_a
  end

  def show
  end

  def new
    @time_zone =
      authorize(scope.new(user: @user, primary: user_or_guest.time_zones.none?))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @time_zone = authorize(scope.new(time_zone_params))

    if @time_zone.save
      log_in(@time_zone.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @time_zone.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    if @time_zone.update(time_zone_params)
      log_in(@time_zone.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @time_zone.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @time_zone.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(TimeZone)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(TimeZone)

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
    scope = searched_policy_scope(TimeZone)
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    TimeZone
  end

  def model_instance
    @time_zone
  end

  def nested(user: @user)
    [user]
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
