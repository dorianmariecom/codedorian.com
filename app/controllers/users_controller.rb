# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :load_user, only: %i[show edit update destroy]
  skip_after_action :verify_policy_scoped, only: %i[new create]

  def index
    authorize User
    @users = scope.page(params[:page])
  end

  def show
    @devices = policy_scope(Device).where(user: @user).page(params[:page])
    @email_addresses =
      policy_scope(EmailAddress).where(user: @user).page(params[:page])
    @locations = policy_scope(Location).where(user: @user).page(params[:page])
    @names = policy_scope(Name).where(user: @user).page(params[:page])
    @passwords = policy_scope(Password).where(user: @user).page(params[:page])
    @phone_numbers =
      policy_scope(PhoneNumber).where(user: @user).page(params[:page])
    @programs = policy_scope(Program).where(user: @user).page(params[:page])
    @time_zones = policy_scope(TimeZone).where(user: @user).page(params[:page])
    @tokens = policy_scope(Token).where(user: @user).page(params[:page])
  end

  def new
    @user = authorize User.new
  end

  def edit
  end

  def create
    @user = authorize User.new(user_params)

    if @user.save
      log_in(@user)
      redirect_to @user, notice: t(".notice")
    else
      flash.now.alert = @user.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      log_in(@user)
      redirect_to user_path(@user), notice: t(".notice")
    else
      flash.now.alert = @user.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy!

    reset_session

    redirect_to root_path, notice: t(".notice")
  end

  def destroy_all
    authorize User

    scope.destroy_all

    redirect_back_or_to(root_path)
  end

  private

  def load_user
    @user =
      if params[:id] == "me"
        authorize current_user
      else
        authorize scope.find(params[:id])
      end
  end

  def scope
    policy_scope(User)
  end

  def user_params
    if admin?
      params.require(:user).permit(
        :admin,
        names_attributes: %i[id _destroy given_name family_name primary verified],
        handles_attributes: %i[id _destroy handle primary verified],
        email_addresses_attributes: %i[id _destroy email_address primary verified],
      )
    else
      params.require(:user).permit(
        names_attributes: %i[id _destroy given_name family_name primary],
        handles_attributes: %i[id _destroy handle primary],
        email_addresses_attributes: %i[id _destroy email_address primary],
      )
    end
  end
end
