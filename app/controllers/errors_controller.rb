# frozen_string_literal: true

class ErrorsController < ApplicationController
  EXCEPTIONS = %i[not_found internal_server_error unprocessable_entity].freeze

  before_action(:load_user)
  before_action { add_breadcrumb(key: "errors.index", path: index_url) }
  before_action(:load_error, only: %i[show destroy])
  skip_after_action(:verify_policy_scoped, only: EXCEPTIONS)

  def index
    authorize(Error)

    @errors = scope.page(params[:page]).order(created_at: :desc)
    @error_occurrences = error_occurrences_scope
  end

  def show
    @error_occurrences =
      error_occurrences_scope.page(params[:page]).order(created_at: :desc)
  end

  def destroy
    @error.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Error)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Error)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  def not_found
    authorize(Error)

    @exception = request.env["action_dispatch.exception"]
    @class = @exception&.class
    @message = @exception&.message
    @backtrace = @exception&.backtrace
    @app_backtrace = Backtrace.app(@backtrace)

    add_breadcrumb

    respond_to do |format|
      format.json { render(json: { message: @message }, status: :not_found) }
      format.html { render(status: :not_found) }
      format.any { redirect_to(root_path, alert: @message) }
    end
  end

  def internal_server_error
    authorize(Error)

    @exception = request.env["action_dispatch.exception"]
    @class = @exception&.class
    @message = @exception&.message
    @backtrace = @exception&.backtrace
    @app_backtrace = Backtrace.app(@backtrace)

    add_breadcrumb

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
    @class = @exception&.class
    @message = @exception&.message
    @backtrace = @exception&.backtrace
    @app_backtrace = Backtrace.app(@backtrace)

    add_breadcrumb

    respond_to do |format|
      format.json do
        render(json: { message: @message }, status: :unprocessable_content)
      end
      format.html { render(status: :unprocessable_content) }
      format.any { redirect_to(root_path, alert: @message) }
    end
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

    set_error_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def load_error
    @error = authorize(scope.find(id))

    set_error_context(error: @error)
    add_breadcrumb(text: @error, path: show_url)
  end

  def id
    params[:error_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(Error)
    scope = scope.where_user(@user) if @user
    scope
  end

  def error_occurrences_scope
    scope = searched_policy_scope(ErrorOccurrence)
    scope = scope.where_user(@user) if @user
    scope = scope.where_error(@error) if @error
    scope
  end

  def model_class
    Error
  end

  def model_instance
    @error
  end

  def nested
    [@user]
  end
end
