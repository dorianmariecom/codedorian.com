# frozen_string_literal: true

class ErrorOccurrencesController < ApplicationController
  before_action(:load_user)
  before_action(:load_error)
  before_action do
    add_breadcrumb(key: "error_occurrences.index", path: index_url)
  end
  before_action(:load_error_occurrence, only: %i[show destroy])

  def index
    authorize(ErrorOccurrence)

    @error_occurrences = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def destroy
    @error_occurrence.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(ErrorOccurrence)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(ErrorOccurrence)

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

    set_error_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def load_error
    return if params[:error_id].blank?

    @error = errors_scope.find(params[:error_id])

    set_error_context(error: @error)
    add_breadcrumb(key: "errors.index", path: [@user, :errors])
    add_breadcrumb(text: @error, path: [@user, @error])
  end

  def load_error_occurrence
    @error_occurrence = authorize(scope.find(id))

    set_error_context(error_occurrence: @error_occurrence)
    add_breadcrumb(text: @error_occurrence, path: show_url)
  end

  def id
    params[:error_occurrence_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(ErrorOccurrence)
    scope = scope.where_user(@user) if @user
    scope = scope.where_error(@error) if @error
    scope
  end

  def errors_scope
    scope = policy_scope(Error)
    scope = scope.where_user(@user) if @user
    scope
  end

  def model_class
    ErrorOccurrence
  end

  def model_instance
    @error_occurrence
  end

  def nested(user: @user, error: @error)
    [user, error]
  end

  def filters
    %i[user error]
  end
end
