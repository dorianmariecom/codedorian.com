# frozen_string_literal: true

class MessagesController < ApplicationController
  before_action :load_user
  before_action :load_message,
                only: %i[
                  show
                  subject
                  body
                  content
                  edit
                  update
                  destroy
                  read
                  unread
                ]

  helper_method :url
  helper_method :new_url

  def index
    authorize Message

    @messages = scope.page(params[:page])
  end

  def show
  end

  def subject
  end

  def body
  end

  def content
  end

  def read
    @message.read!

    redirect_back_or_to(@message)
  end

  def unread
    @message.unread!

    redirect_back_or_to(@message)
  end

  def new
    @message = authorize scope.new
  end

  def edit
  end

  def create
    @message = authorize scope.new(message_params)

    if @message.save
      log_in(@message.from_user)
      redirect_to @message, notice: t(".notice")
    else
      flash.now.alert = @message.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @message.update(message_params)
      log_in(@message.from_user)
      redirect_to @message, notice: t(".notice")
    else
      flash.now.alert = @message.alert
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @message.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize Message

    scope.destroy_all

    redirect_back_or_to(messages_path)
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
    if @user
      base_scope.where(from_user: @user).or(base_scope.where(to_user: @user))
    else
      policy_scope(Message)
    end
  end

  def base_scope
    policy_scope(Message)
  end

  def url
    @user ? [@user, :messages] : messages_path
  end

  def new_url
    @user ? [:new, @user, :message] : new_message_path
  end

  def id
    params[:message_id].presence || params[:id]
  end

  def load_message
    @message = authorize scope.find(id)
  end

  def message_params
    if admin?
      params.expect(message: %i[from_user_id to_user_id subject body read])
    else
      params.expect(message: %i[subject body])
    end
  end
end
