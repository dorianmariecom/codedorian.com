# frozen_string_literal: true

class ErrorsController < ApplicationController
  EXCEPTIONS = %i[not_found internal_server_error unprocessable_entity].freeze

  before_action(:load_user)
  before_action(:load_error, only: %i[show destroy])
  skip_after_action(:verify_policy_scoped, only: EXCEPTIONS)
  helper_method(:url)
  helper_method(:delete_all_url)
  helper_method(:destroy_all_url)

  def index
    authorize(Error)

    @errors = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @error_occurrences =
      policy_scope(ErrorOccurrence)
        .where(error: @error)
        .page(params[:page])
        .order(created_at: :desc)
  end

  def destroy
    @error.destroy!

    redirect_to(url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Error)

    scope.destroy_all

    redirect_back_or_to(url)
  end

  def delete_all
    authorize(Error)

    scope.delete_all

    redirect_back_or_to(url)
  end

  def not_found
    authorize(Error)

    @exception = request.env["action_dispatch.exception"]
    @class = @exception.class
    @message = @exception.message
    @backtrace = @exception.backtrace
    @app_backtrace = Backtrace.app(@backtrace)

    respond_to do |format|
      format.json { render(json: { message: @message }, status: :not_found) }
      format.html { render(status: :not_found) }
      format.any { redirect_to(root_path, alert: @message) }
    end
  end

  def internal_server_error
    authorize(Error)

    @exception = request.env["action_dispatch.exception"]
    @class = @exception.class
    @message = @exception.message
    @backtrace = @exception.backtrace
    @app_backtrace = Backtrace.app(@backtrace)

    respond_to do |format|
      format.json do
        render(json: { message: @message }, status: :internal_server_error)
      end
      format.html { render(status: :internal_server_error) }
      format.any { redirect_to(root_path, alert: @message) }
    end
  end

  def unprocessable_entity
    authorize(Error)

    @exception = request.env["action_dispatch.exception"]
    @class = @exception.class
    @message = @exception.message
    @backtrace = @exception.backtrace
    @app_backtrace = Backtrace.app(@backtrace)

    respond_to do |format|
      format.json do
        render(json: { message: @message }, status: :unprocessable_entity)
      end
      format.html { render(status: :unprocessable_entity) }
      format.any { redirect_to(root_path, alert: @message) }
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
    @error = authorize(scope.find(params[:error_id].presence || params[:id]))
  end

  def scope
    searched_policy_scope(Error)
  end

  def delete_all_url
    [:delete_all, @user, :errors, { search: { q: q } }].compact
  end

  def destroy_all_url
    [:destroy_all, @user, :errors, { search: { q: q } }].compact
  end

  def url
    [@user, :errors].compact
  end
end
