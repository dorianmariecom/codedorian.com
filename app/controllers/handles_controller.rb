# frozen_string_literal: true

class HandlesController < ApplicationController
  before_action :load_user
  before_action :load_handle, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url

  def index
    authorize Handle

    @handles = scope.page(params[:page])
  end

  def show
  end

  def new
    @handle = authorize scope.new(primary: current_user.handles.none?)
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

  private

  def load_user
    if params[:user_id] == "me"
      @user = current_user
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def scope
    @user ? policy_scope(Handle).where(user: @user) : policy_scope(Handle)
  end

  def url
    @user ? [@user, :handles] : handles_path
  end

  def new_url
    @user ? [:new, @user, :handle] : new_handle_path
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
