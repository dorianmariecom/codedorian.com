# frozen_string_literal: true

class ExecutionsController < ApplicationController
  before_action :load_user
  before_action :load_program
  before_action :load_execution, only: %i[show destroy]

  helper_method :url

  def index
    authorize Execution

    @executions = scope.page(params[:page])
  end

  def show
  end

  def destroy
    @execution.destroy!

    redirect_to url, notice: t(".notice")
  end

  def destroy_all
    authorize Execution

    scope.destroy_all

    redirect_back_or_to(executions_path)
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
    if @user && @program
      policy_scope(Execution).joins(:program).where(
        program: {
          id: @program,
          user_id: @user.id
        }
      )
    elsif @user
      policy_scope(Execution).joins(:program).where(
        program: {
          user_id: @user.id
        }
      )
    elsif @program
      policy_scope(Execution).where(program: @program)
    else
      policy_scope(Execution)
    end
  end

  def url
    if @user && @program
      [@user, @program, :executions]
    elsif @user
      [@user, :executions]
    elsif @program
      [@program, :executions]
    else
      executions_path
    end
  end

  def id
    params[:execution_id].presence || params[:id]
  end

  def load_execution
    @execution = authorize scope.find(id)
  end
end
