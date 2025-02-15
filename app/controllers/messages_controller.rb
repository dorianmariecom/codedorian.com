# frozen_string_literal: true

class MessagesController < ApplicationController
  before_action :load_user
  before_action :load_message,
                only: %i[show edit update destroy]

  helper_method :url
  helper_method :new_url

  def index
    authorize Message

    @messages = scope.page(params[:page])
  end

  def show
    @executions =
      policy_scope(Execution)
        .where(message: @message)
        .order(created_at: :desc)
        .page(params[:page])

    @schedules =
      policy_scope(Schedule)
        .where(message: @message)
        .order(created_at: :desc)
        .page(params[:page])
  end

  def evaluate
    @message.evaluate!

    redirect_back_or_to(@message)
  end

  def schedule
    @message.schedule!

    redirect_back_or_to(@message)
  end

  def unschedule
    @message.unschedule!

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
      log_in(@message.user)
      redirect_to @message, notice: t(".notice")
    else
      flash.now.alert = @message.alert
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @message.update(message_params)
      log_in(@message.user)
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
      @user = current_user
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def scope
    @user ? policy_scope(Message).where(user: @user) : policy_scope(Message)
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
      params.require(:message).permit(
        :from_user_id,
        :to_user_id,
        :subject,
        :body,
        :seen,
        :read
      )
    else
      params.require(:message).permit(
        :user_id,
        :title,
        :subject,
        :body,
        :read
      )
    end
  end
end
