# frozen_string_literal: true

class PromptsController < ApplicationController
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_prompt, only: %i[show destroy])

  def index
    authorize(Prompt)

    @prompts = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @schedules =
      policy_scope(Schedule)
        .where(schedulable: @prompt)
        .order(created_at: :asc)
        .page(params[:page])
  end

  def destroy
    @prompt.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Prompt)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(Prompt)

    scope.delete_all

    redirect_back_or_to(index_url)
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

    @program = policy_scope(Program).find(params[:program_id])
  end

  def scope
    scope = searched_policy_scope(Prompt)
    scope = scope.where(user: @user) if @user
    scope = scope.where(program: @program) if @program
    scope
  end

  def model_class
    Prompt
  end

  def model_instance
    @prompt
  end

  def nested
    [@user, @program]
  end

  def id
    params[:prompt_id].presence || params[:id]
  end

  def load_prompt
    @prompt = authorize(scope.find(id))
  end
end
