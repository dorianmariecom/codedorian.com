# frozen_string_literal: true

class SessionsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action { add_breadcrumb(key: "sessions.index", path: index_url) }
  before_action(:load_session, only: %i[show edit update destroy delete])
  skip_after_action(:verify_policy_scoped)

  def index
    authorize(Session)

    @sessions = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @session = authorize(scope.new)
    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @session = authorize(scope.new)
    @session.assign_attributes(session_params(@session))

    if @session.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @session.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @session.assign_attributes(session_params(@session))

    if @session.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @session.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @session.destroy!
    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @session.delete
    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Session)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Session)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def id
    params[:session_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(Session)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_session(@session) if @session
    scope
  end

  def model_class
    Session
  end

  def model_instance
    @session
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
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

  def load_session
    @session = authorize(scope.find(id))
    set_context(session: @session)
    add_breadcrumb(text: @session, path: show_url)
  end

  def session_params(_session)
    admin? ? params.expect(session: %i[session_id data]) : {}
  end
end
