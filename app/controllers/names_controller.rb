# frozen_string_literal: true

class NamesController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action { add_breadcrumb(key: "names.index", path: index_url) }
  before_action(:load_name, only: %i[show edit update destroy delete])

  def index
    authorize(Name)

    @names = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @name =
      authorize(scope.new(user: @user, primary: user_or_guest.names.none?))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @name = authorize(scope.new(name_params))

    if @name.save(context: :controller)
      log_in(@name.user)
      @user = @name.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @name.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @name.assign_attributes(name_params)

    if @name.save(context: :controller)
      log_in(@name.user)
      @user = @name.user
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @name.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @name.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @name.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(Name)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Name)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        policy_scope(Guest).find(current_guest&.id)
      else
        policy_scope(Guest).find(params[:guest_id])
      end

    set_context(guest: @guest)
    add_breadcrumb(key: "guests.index", path: :guests)
    add_breadcrumb(text: @guest, path: @guest)
  end

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
    scope = searched_policy_scope(Name)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_name(@name) if @name
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_name(@name) if @name
    scope
  end

  def model_class
    Name
  end

  def model_instance
    @name
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
  end

  def id
    params[:name_id].presence || params[:id]
  end

  def load_name
    @name = authorize(scope.find(id))
    set_context(name: @name)
    add_breadcrumb(text: @name, path: show_url)
  end

  def name_params
    if admin?
      params.expect(name: %i[user_id primary verified given_name family_name])
    else
      params.expect(name: %i[primary given_name family_name])
    end
  end
end
