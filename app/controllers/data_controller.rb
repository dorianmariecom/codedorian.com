# frozen_string_literal: true

class DataController < ApplicationController
  before_action(:load_user)
  before_action(:load_datum, only: %i[show edit update destroy])

  def index
    authorize(Datum)

    @data = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def new
    @datum = authorize(scope.new(user: @user))
  end

  def edit
  end

  def create
    @datum = authorize(scope.new(datum_params))

    if @datum.save(context: :controller)
      log_in(@datum.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @datum.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    @datum.assign_attributes(datum_params)

    if @datum.save(context: :controller)
      log_in(@datum.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @datum.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @datum.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Datum)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Datum)

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

  def scope
    scope = searched_policy_scope(Datum)
    scope = scope.where(user: @user) if @user
    scope
  end

  def model_class
    Datum
  end

  def model_instance
    @datum
  end

  def nested
    [@user]
  end

  def id
    params[:datum_id].presence || params[:id]
  end

  def load_datum
    @datum = authorize(scope.find(id))
    set_error_context(datum: @datum)
  end

  def datum_params
    if admin?
      params.expect(datum: %i[user_id key value])
    else
      params.expect(datum: %i[key value])
    end
  end
end
