# frozen_string_literal: true

class HandlesController < ApplicationController
  before_action(:load_user)
  before_action { add_breadcrumb(key: "handles.index", path: index_url) }
  before_action(:load_handle, only: %i[show edit update destroy])

  def index
    authorize(Handle)

    @handles = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
  end

  def new
    @handle =
      authorize(scope.new(user: @user, primary: user_or_guest.handles.none?))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @handle = authorize(scope.new(handle_params))

    if @handle.save
      log_in(@handle.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @handle.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    if @handle.update(handle_params)
      log_in(@handle.user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @handle.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @handle.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Handle)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Handle)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  private

  def load_user
    return if params[:user_id].blank?
    return if params[:user_id] == "me" && current_user.nil?

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
    scope = searched_policy_scope(Handle)
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    Handle
  end

  def model_instance
    @handle
  end

  def nested(user: @user)
    [user]
  end

  def filters
    [:user]
  end

  def id
    params[:handle_id].presence || params[:id]
  end

  def load_handle
    @handle = authorize(scope.find(id))
    set_context(handle: @handle)
    add_breadcrumb(text: @handle, path: show_url)
  end

  def handle_params
    if admin?
      params.expect(handle: %i[user_id primary verified handle])
    else
      params.expect(handle: %i[primary handle])
    end
  end
end
