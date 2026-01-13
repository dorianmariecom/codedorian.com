# frozen_string_literal: true

class MessagesController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action { add_breadcrumb(key: "messages.index", path: index_url) }
  before_action(
    :load_message,
    only: %i[show subject body content edit update destroy]
  )

  def index
    authorize(Message)

    @messages =
      scope
        .includes(:rich_text_subject, :rich_text_body)
        .page(params[:page])
        .order(created_at: :desc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def subject
    add_breadcrumb
  end

  def body
    add_breadcrumb
  end

  def content
    add_breadcrumb
  end

  def new
    @message = authorize(scope.new(from_user: @user, to_user: @user))
    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @message = authorize(scope.new(message_params))

    if @message.save(context: :controller)
      log_in(@message.from_user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @message.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @message.assign_attributes(message_params)

    if @message.save(context: :controller)
      log_in(@message.from_user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @message.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @message.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @message.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(Message)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Message)

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

  def scope
    scope = searched_policy_scope(Message)
    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_message(@message) if @message
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_message(@message) if @message
    scope
  end

  def model_class
    Message
  end

  def model_instance
    @message
  end

  def nested(user: @user, guest: @guest)
    [user || guest]
  end

  def filters
    [:user]
  end

  def id
    params[:message_id].presence || params[:id]
  end

  def load_message
    @message = authorize(scope.find(id))
    set_context(message: @message)
    add_breadcrumb(text: @message, path: show_url)
  end

  def message_params
    if admin?
      params.expect(message: %i[from_user_id to_user_id subject body])
    else
      params.expect(message: %i[subject body])
    end
  end
end
