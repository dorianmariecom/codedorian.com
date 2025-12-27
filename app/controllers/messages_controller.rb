# frozen_string_literal: true

class MessagesController < ApplicationController
  before_action(:load_user)
  before_action { add_breadcrumb(key: "messages.index", path: index_url) }
  before_action(
    :load_message,
    only: %i[show subject body content edit update destroy]
  )

  def index
    authorize(Message)

    @messages = scope.page(params[:page]).order(created_at: :desc).to_a
  end

  def show
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

    if @message.save
      log_in(@message.from_user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @message.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    if @message.update(message_params)
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

  def destroy_all
    authorize(Message)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Message)

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

  def scope
    scope = searched_policy_scope(Message)
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    Message
  end

  def model_instance
    @message
  end

  def nested(user: @user)
    [user]
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
