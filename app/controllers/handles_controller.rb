# frozen_string_literal: true

class HandlesController < ApplicationController
  before_action :load_user
  before_action :load_handle, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url
  helper_method :delete_all_url
  helper_method :destroy_all_url

  def index
    authorize Handle

    @handles = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @handle =
      authorize scope.new(user: @user, primary: user_or_guest.handles.none?)
  end

  def edit
  end

  def create
    @handle = authorize scope.new(handle_params)

    if @handle.save
      log_in(@handle.user)
      redirect_to @handle, notice: t(".notice")
    else
      flash.now.alert = @handle.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @handle.update(handle_params)
      log_in(@handle.user)
      redirect_to @handle, notice: t(".notice")
    else
      flash.now.alert = @handle.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @handle.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize Handle

    scope.destroy_all

    redirect_back_or_to(url)
  end

  def delete_all
    authorize Handle

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
    scope = searched_policy_scope(Handle)
    scope = scope.where(user: @user) if @user
    scope
  end

  def delete_all_url
    [:delete_all, @user, :handles, { search: { q: q } }].compact
  end

  def destroy_all_url
    [:destroy_all, @user, :handles, { search: { q: q } }].compact
  end

  def url
    [@user, :handles].compact
  end

  def new_url
    [:new, @user, :handle].compact
  end

  def id
    params[:handle_id].presence || params[:id]
  end

  def load_handle
    @handle = authorize scope.find(id)
  end

  def handle_params
    if admin?
      params.expect(handle: %i[user_id primary verified handle])
    else
      params.expect(handle: %i[primary handle])
    end
  end
end
