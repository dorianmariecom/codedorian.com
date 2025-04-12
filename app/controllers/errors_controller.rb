# frozen_string_literal: true

class ErrorsController < ApplicationController
  EXCEPTIONS = %i[not_found internal_server_error unprocessable_entity].freeze
  MESSAGE_LIMIT = 140

  before_action :load_user
  before_action :load_error, only: %i[show destroy]
  skip_after_action :verify_authorized, only: EXCEPTIONS
  skip_after_action :verify_policy_scoped, only: EXCEPTIONS
  helper_method :url, :message_limit, :omission

  def index
    authorize SolidErrors::Error

    @errors = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @error_occurrences =
      policy_scope(SolidErrors::Occurrence)
        .where(error: @error)
        .page(params[:page])
        .order(created_at: :desc)
  end

  def destroy
    @error.destroy!

    redirect_to(url, notice: t(".notice"))
  end

  def destroy_all
    authorize SolidErrors::Error

    scope.destroy_all

    redirect_back_or_to(url, notice: t(".notice"))
  end

  def not_found
    @exception = request.env["action_dispatch.exception"]

    respond_to do |format|
      format.json { render(json: { message: :not_found }, status: :not_found) }
      format.html { render status: :not_found }
      format.all { redirect_to root_path, alert: t(".title") }
    end
  end

  def internal_server_error
    @exception = request.env["action_dispatch.exception"]

    respond_to do |format|
      format.json do
        render(
          json: {
            message: :internal_server_error
          },
          status: :internal_server_error
        )
      end
      format.html { render status: :internal_server_error }
      format.all { redirect_to root_path, alert: t(".title") }
    end
  end

  def unprocessable_entity
    @exception = request.env["action_dispatch.exception"]

    respond_to do |format|
      format.json do
        render(
          json: {
            message: :unprocessable_entity
          },
          status: :unprocessable_entity
        )
      end
      format.html { render status: :unprocessable_entity }
      format.all { redirect_to root_path, alert: t(".title") }
    end
  end

  private

  def load_user
    if params[:user_id] == "me"
      @user = policy_scope(User).find(current_user&.id)
    elsif params[:user_id].present?
      @user = policy_scope(User).find(params[:user_id])
    end
  end

  def load_error
    @error = authorize scope.find(params[:error_id].presence || params[:id])
  end

  def scope
    policy_scope(SolidErrors::Error)
  end

  def url
    [@user, :errors].compact
  end

  def message_limit
    MESSAGE_LIMIT
  end

  def omission
    OMISSION
  end
end
