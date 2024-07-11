# frozen_string_literal: true

class DataController < ApplicationController
  before_action :load_user
  before_action :load_datum, only: %i[show edit update destroy]

  def index
    authorize Datum

    @datums = scope
  end

  def show
  end

  def new
    @datum = authorize scope.new
  end

  def redirect
  end

  def create
    unless current_user
      Current.user = User.create!
      session[:user_id] = Current.user.id
    end

    @datum = authorize scope.new(datum_params)

    if @datum.save
      redirect_to @datum, notice: t(".notice")
    else
      flash.now.alert = @datum.alert
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @datum.update(datum_params)
      redirect_to @datum, notice: t(".notice")
    else
      flash.now.alert = @datum.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @datum.destroy!

    redirect_to @datum.user, notice: t(".notice")
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
    @user ? policy_scope(Datum).where(user: @user) : policy_scope(Datum)
  end

  def id
    params[:datum_id].presence || params[:id]
  end

  def load_datum
    @datum = authorize scope.find(id)
  end

  def datum_params
    if admin?
      params.require(:datum).permit(:user_id, :data)
    else
      params.require(:datum).permit(:data)
    end
  end
end
