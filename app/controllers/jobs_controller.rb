# frozen_string_literal: true

class JobsController < ApplicationController
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_repl_program)
  before_action(:load_prompt)
  before_action(:load_repl_prompt)
  before_action(:load_job, only: %i[show destroy delete discard retry])

  def index
    authorize(Job)

    @jobs = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def retry
    @job.retry!

    redirect_to(index_url, notice: t(".notice"))
  end

  def discard
    @job.discard!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @job.delete!

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy
    @job.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def retry_all
    authorize(Job)

    scope.retry_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def discard_all
    authorize(Job)

    scope.discard_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Job)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Job)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
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

  def load_repl_program
    return if params[:repl_program_id].blank?

    @repl_program = policy_scope(ReplProgram).find(params[:repl_program_id])
  end

  def load_prompt
    return if params[:prompt_id].blank?

    @prompt = policy_scope(Prompt).find(params[:prompt_id])
  end

  def load_repl_prompt
    return if params[:repl_prompt_id].blank?

    @repl_prompt = policy_scope(ReplPrompt).find(params[:repl_prompt_id])
  end

  def load_job
    @job = authorize(scope.find(params[:job_id].presence || params[:id]))
  end

  def scope
    searched_policy_scope(Job)
  end

  def model_class
    Job
  end

  def model_instance
    @job
  end

  def nested
    [@user, @program || @repl_program, @prompt || @repl_prompt]
  end
end
