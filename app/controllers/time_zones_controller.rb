# frozen_string_literal: true

class TimeZonesController < ApplicationController
  before_action :load_user
  before_action :load_time_zone, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url

  def index
    authorize TimeZone

    @time_zones = scope.page(params[:page])
  end

  def show
  end

  def new
    @time_zone = authorize scope.new
  end

  def edit
  end

  def create
    @time_zone = authorize scope.new(time_zone_params)

    if @time_zone.save
      log_in(@time_zone.user)
      redirect_to @time_zone, notice: t(".notice")
    else
      flash.now.alert = @time_zone.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @time_zone.update(time_zone_params)
      log_in(@time_zone.user)
      redirect_to @time_zone, notice: t(".notice")
    else
      flash.now.alert = @time_zone.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @time_zone.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize TimeZone

    scope.destroy_all

    redirect_back_or_to(url)
  end

  private

  def load_user
    if params[:user_id] == "me"
      @user = current_user
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def scope
    @user ? policy_scope(TimeZone).where(user: @user) : policy_scope(TimeZone)
  end

  def url
    @user ? [@user, :time_zones] : time_zones_path
  end

  def new_url
    @user ? [:new, @user, :time_zone] : new_time_zone_path
  end

  def id
    params[:time_zone_id].presence || params[:id]
  end

  def load_time_zone
    @time_zone = authorize scope.find(id)
  end

  def time_zone_params
    if admin?
      params.expect(time_zone: %i[user_id primary verified time_zone])
    else
      params.expect(time_zone: %i[user_id primary time_zone])
    end
  end
end
