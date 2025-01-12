# frozen_string_literal: true

class PhoneNumbersController < ApplicationController
  before_action :load_user
  before_action :load_phone_number, only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url

  def index
    authorize PhoneNumber

    @phone_numbers = scope.page(params[:page])
  end

  def show
  end

  def new
    @phone_number =
      authorize scope.new(primary: current_user.phone_numbers.none?)
  end

  def edit
  end

  def create
    @phone_number = authorize scope.new(phone_number_params)

    if @phone_number.save
      log_in(@phone_number.user)
      redirect_to @phone_number, notice: t(".notice")
    else
      flash.now.alert = @phone_number.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @phone_number.update(phone_number_params)
      log_in(@phone_number.user)
      redirect_to @phone_number, notice: t(".notice")
    else
      flash.now.alert = @phone_number.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @phone_number.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize PhoneNumber

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
    if @user
      policy_scope(PhoneNumber).where(user: @user)
    else
      policy_scope(PhoneNumber)
    end
  end

  def url
    @user ? [@user, :phone_numbers] : phone_numbers_path
  end

  def new_url
    @user ? [:new, @user, :phone_number] : new_phone_number_path
  end

  def id
    params[:phone_number_id].presence || params[:id]
  end

  def load_phone_number
    @phone_number = authorize scope.find(id)
  end

  def phone_number_params
    if admin?
      params.require(:phone_number).permit(
        :user_id,
        :primary,
        :verified,
        :phone_number
      )
    else
      params.require(:phone_number).permit(:user_id, :primary, :phone_number)
    end
  end
end
