# frozen_string_literal: true

class NamesController < ApplicationController
  before_action :load_user
  before_action :load_name, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url

  def index
    authorize Name

    @names = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @name = authorize scope.new(user: @user, primary: user_or_guest.names.none?)
  end

  def edit
  end

  def create
    @name = authorize scope.new(name_params)

    if @name.save
      log_in(@name.user)
      redirect_to @name, notice: t(".notice")
    else
      flash.now.alert = @name.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @name.update(name_params)
      log_in(@name.user)
      redirect_to @name, notice: t(".notice")
    else
      flash.now.alert = @name.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @name.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize Name

    scope.destroy_all

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
    @user ? policy_scope(Name).where(user: @user) : policy_scope(Name)
  end

  def url
    [@user, :names].compact
  end

  def new_url
    [:new, @user, :name].compact
  end

  def id
    params[:name_id].presence || params[:id]
  end

  def load_name
    @name = authorize scope.find(id)
  end

  def name_params
    if admin?
      params.expect(name: %i[user_id primary verified given_name family_name])
    else
      params.expect(name: %i[primary given_name family_name])
    end
  end
end
