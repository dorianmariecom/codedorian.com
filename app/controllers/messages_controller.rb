# frozen_string_literal: true

class MessagesController < ApplicationController
  before_action(:load_user)
  before_action(
    :load_message,
    only: %i[show subject body content edit update destroy]
  )

  def index
    authorize(Message)

    @messages = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def subject
  end

  def body
  end

  def content
  end

  def new
    @message = authorize(scope.new(from_user: @user, to_user: @user))
  end

  def edit
  end

  def create
    @message = authorize(scope.new(message_params))

    if @message.save
      log_in(@message.from_user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @message.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    if @message.update(message_params)
      log_in(@message.from_user)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @message.alert
      render(:edit, status: :unprocessable_entity)
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
    if params[:user_id] == "me"
      @user = policy_scope(User).find(current_user&.id)
      set_error_context(user: @user)
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
      set_error_context(user: @user)
    end
  end

  def scope
    scope = searched_policy_scope(Message)

    if @user
      scope = scope.where(from_user: @user).or(scope.where(to_user: @user))
    end

    scope
  end

  def model_class
    Message
  end

  def model_instance
    @message
  end

  def nested
    [@user]
  end

  def id
    params[:message_id].presence || params[:id]
  end

  def load_message
    @message = authorize(scope.find(id))
    set_error_context(message: @message)
  end

  def message_params
    if admin?
      params.expect(message: %i[from_user_id to_user_id subject body])
    else
      params.expect(message: %i[subject body])
    end
  end
end
