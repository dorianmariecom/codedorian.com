# frozen_string_literal: true

class ProgramExecutionsController < ApplicationController
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_program_execution, only: %i[show destroy])

  def index
    authorize(ProgramExecution)

    @program_executions = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def destroy
    @program_execution.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(ProgramExecution)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(ProgramExecution)

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

  def load_program
    return if params[:program_id].blank?

    @program =
      if @user
        policy_scope(Program).where(user: @user).find(params[:program_id])
      else
        policy_scope(Program).find(params[:program_id])
      end

    set_error_context(program: @program)
  end

  def scope
    scope = searched_policy_scope(ProgramExecution)
    scope = scope.where(program: @program) if @program
    scope = scope.joins(:user).where(user: { id: @user }) if @user
    scope
  end

  def model_class
    ProgramExecution
  end

  def model_instance
    @program_execution
  end

  def nested
    [@user, @program]
  end

  def id
    params[:program_execution_id].presence || params[:id]
  end

  def load_program_execution
    @program_execution = authorize(scope.find(id))
    set_error_context(program_execution: @program_execution)
  end
end
