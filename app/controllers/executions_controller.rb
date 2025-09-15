# frozen_string_literal: true

class ExecutionsController < ApplicationController
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_execution, only: %i[show destroy])

  helper_method(:url)
  helper_method(:delete_all_url)
  helper_method(:destroy_all_url)

  def index
    authorize(Execution)

    @executions = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def destroy
    @execution.destroy!

    redirect_to(url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Execution)

    scope.destroy_all

    redirect_back_or_to(url)
  end

  def delete_all
    authorize(Execution)

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

  def load_program
    return if params[:program_id].blank?

    @program =
      if @user
        policy_scope(Program).where(user: @user).find(params[:program_id])
      else
        policy_scope(Program).find(params[:program_id])
      end
  end

  def scope
    scope = searched_policy_scope(Execution)
    scope = scope.where(program: @program) if @program
    scope = scope.joins(:user).where(user: { id: @user }) if @user
    scope
  end

  def delete_all_url
    [:delete_all, @user, @program, :executions, { search: { q: q } }].compact
  end

  def destroy_all_url
    [:destroy_all, @user, @program, :executions, { search: { q: q } }].compact
  end

  def url
    [@user, @program, :executions].compact
  end

  def id
    params[:execution_id].presence || params[:id]
  end

  def load_execution
    @execution = authorize(scope.find(id))
  end
end
