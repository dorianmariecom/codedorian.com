# frozen_string_literal: true

class PhoneNumbersController < ApplicationController
  before_action(:load_user)
  before_action { add_breadcrumb(key: "phone_numbers.index", path: index_url) }
  before_action(:load_phone_number, only: %i[show edit update destroy])

  def index
    authorize(PhoneNumber)

    @phone_numbers = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @phone_number =
      authorize(
        PhoneNumber.new(user: @user, primary: user_or_guest.phone_numbers.none?)
      )

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @phone_number = authorize(policy_scope(PhoneNumber).new(phone_number_params))

    if @phone_number.save
      log_in(@phone_number.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @phone_number.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    if @phone_number.update(phone_number_params)
      log_in(@phone_number.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @phone_number.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @phone_number.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(PhoneNumber)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(PhoneNumber)

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
    scope = searched_policy_scope(PhoneNumber)
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    PhoneNumber
  end

  def model_instance
    @phone_number
  end

  def nested(user: @user)
    [user]
  end

  def filters
    [:user]
  end

  def id
    params[:phone_number_id].presence || params[:id]
  end

  def load_phone_number
    @phone_number = authorize(scope.find(id))
    set_context(phone_number: @phone_number)
    add_breadcrumb(text: @phone_number, path: show_url)
  end

  def phone_number_params
    if admin?
      params.expect(phone_number: %i[user_id primary verified phone_number])
    else
      params.expect(phone_number: %i[primary phone_number])
    end
  end
end
