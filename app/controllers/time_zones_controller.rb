# frozen_string_literal: true

class TimeZonesController < ApplicationController
  before_action(:load_user)
  before_action(:load_time_zone, only: %i[show edit update destroy])

  def index
    authorize(TimeZone)

    @time_zones = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @time_zone =
      authorize(scope.new(user: @user, primary: user_or_guest.time_zones.none?))
  end

  def edit
  end

  def create
    @time_zone = authorize(scope.new(time_zone_params))

    if @time_zone.save
      log_in(@time_zone.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @time_zone.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    if @time_zone.update(time_zone_params)
      log_in(@time_zone.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @time_zone.alert
      render(:edit, status: :unprocessable_entity)
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
    scope = searched_policy_scope(TimeZone)
    scope = scope.where(user: @user) if @user
    scope
  end

  def model_class
    TimeZone
  end

  def model_instance
    @time_zone
  end

  def nested
    [@user]
  end

  def id
    params[:time_zone_id].presence || params[:id]
  end

  def load_time_zone
    @time_zone = authorize(scope.find(id))
    set_error_context(time_zone: @time_zone)
  end

  def time_zone_params
    if admin?
      params.expect(time_zone: %i[user_id primary verified time_zone])
    else
      params.expect(time_zone: %i[primary time_zone])
    end
  end
end
