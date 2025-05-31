# frozen_string_literal: true

class TimeZonesController < ApplicationController
  before_action :load_user
  before_action :load_time_zone, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url
  helper_method :delete_all_url
  helper_method :destroy_all_url

  def index
    authorize TimeZone

    @time_zones = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @time_zone =
      authorize scope.new(user: @user, primary: user_or_guest.time_zones.none?)
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

  def delete_all
    authorize TimeZone

    scope.delete_all

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
    scope = searched_policy_scope(TimeZone)
    scope = scope.where(user: @user) if @user
    scope
  end

  def delete_all_url
    [:delete_all, @user, :time_zones, { search: { q: q } }].compact
  end

  def destroy_all_url
    [:destroy_all, @user, :time_zones, { search: { q: q } }].compact
  end

  def url
    [@user, :time_zones].compact
  end

  def new_url
    [:new, @user, :time_zone].compact
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
      params.expect(time_zone: %i[primary time_zone])
    end
  end
end
