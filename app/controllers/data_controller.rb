# frozen_string_literal: true

class DataController < ApplicationController
  before_action(:load_user)
  before_action(:load_datum, only: %i[show edit update destroy])

  helper_method(:url)
  helper_method(:new_url)
  helper_method(:delete_all_url)
  helper_method(:destroy_all_url)

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
      redirect_to(@datum, notice: t(".notice"))
    else
      flash.now.alert = @datum.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    @datum.assign_attributes(datum_params)

    if @datum.save(context: :controller)
      log_in(@datum.user)
      redirect_to(@datum, notice: t(".notice"))
    else
      flash.now.alert = @datum.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @datum.destroy!

    redirect_to(url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Datum)

    scope.destroy_all

    redirect_back_or_to(url)
  end

  def delete_all
    authorize(Datum)

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

  def scope
    scope = searched_policy_scope(Datum)
    scope = scope.where(user: @user) if @user
    scope
  end

  def url
    [@user, :data].compact
  end

  def new_url
    [:new, @user, :datum].compact
  end

  def delete_all_url
    [:delete_all, @user, :data, { search: { q: q } }].compact
  end

  def destroy_all_url
    [:destroy_all, @user, :data, { search: { q: q } }].compact
  end

  def id
    params[:datum_id].presence || params[:id]
  end

  def load_datum
    @datum = authorize(scope.find(id))
  end

  def datum_params
    if admin?
      params.expect(datum: %i[user_id key value])
    else
      params.expect(datum: %i[key value])
    end
  end
end
