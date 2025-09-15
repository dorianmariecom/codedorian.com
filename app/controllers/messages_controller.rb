# frozen_string_literal: true

class MessagesController < ApplicationController
  before_action(:load_user)
  before_action(
    :load_message,
    only: %i[show subject body content edit update destroy]
  )

  helper_method(:url)
  helper_method(:new_url)
  helper_method(:delete_all_url)
  helper_method(:destroy_all_url)

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
      redirect_to(@message, notice: t(".notice"))
    else
      flash.now.alert = @message.alert
      render(:new, status: :unprocessable_entity)
    end
  end

  def update
    if @message.update(message_params)
      log_in(@message.from_user)
      redirect_to(@message, notice: t(".notice"))
    else
      flash.now.alert = @message.alert
      render(:edit, status: :unprocessable_entity)
    end
  end

  def destroy
    @message.destroy!

    redirect_to(url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Message)

    scope.destroy_all

    redirect_back_or_to(url)
  end

  def delete_all
    authorize(Message)

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
    scope = searched_policy_scope(Message)

    if @user
      scope = scope.where(from_user: @user).or(scope.where(to_user: @user))
    end

    scope
  end

  def delete_all_url
    [:delete_all, @user, :messages, { search: { q: q } }].compact
  end

  def destroy_all_url
    [:destroy_all, @user, :messages, { search: { q: q } }].compact
  end

  def url
    [@user, :messages].compact
  end

  def new_url
    [:new, @user, :message].compact
  end

  def id
    params[:message_id].presence || params[:id]
  end

  def load_message
    @message = authorize(scope.find(id))
  end

  def message_params
    if admin?
      params.expect(message: %i[from_user_id to_user_id subject body read])
    else
      params.expect(message: %i[subject body])
    end
  end
end
