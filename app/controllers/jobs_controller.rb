# frozen_string_literal: true

class JobsController < ApplicationController
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

  def load_job
    @job = authorize(scope.find(id))

    set_error_context(job: @job)
  end

  def id
    params[:job_id].presence || params[:id]
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
