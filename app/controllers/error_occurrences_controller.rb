# frozen_string_literal: true

class ErrorOccurrencesController < ApplicationController
  MESSAGE_LIMIT = 140

  before_action :load_user
  before_action :load_error
  before_action :load_error_occurrence, only: %i[show destroy]
  helper_method :url
  helper_method :message_limit
  helper_method :omission
  helper_method :delete_all_url
  helper_method :destroy_all_url

  def index
    authorize ErrorOccurrence

    @error_occurrences = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def destroy
    @error_occurrence.destroy!

    redirect_to(url, notice: t(".notice"))
  end

  def destroy_all
    authorize ErrorOccurrence

    scope.destroy_all

    redirect_back_or_to(url)
  end

  def delete_all
    authorize ErrorOccurrence

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

  def load_error
    return if params[:error_id].blank?

    @error = policy_scope(Error).find(params[:error_id])
  end

  def load_error_occurrence
    @error_occurrence =
      authorize scope.find(params[:error_id].presence || params[:id])
  end

  def scope
    scope = searched_policy_scope(ErrorOccurrence)
    scope = scope.where(error: @error) if @error
    scope
  end

  def delete_all_url
    [
      :delete_all,
      @user,
      @error,
      :error_occurrences,
      { search: { q: q } }
    ].compact
  end

  def destroy_all_url
    [
      :destroy_all,
      @user,
      @error,
      :error_occurrences,
      { search: { q: q } }
    ].compact
  end

  def url
    [@user, @error, :error_occurrences].compact
  end

  def message_limit
    MESSAGE_LIMIT
  end

  def omission
    OMISSION
  end
end
