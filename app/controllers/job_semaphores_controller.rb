# frozen_string_literal: true

class JobSemaphoresController < ApplicationController
  before_action { add_breadcrumb(key: "job_semaphores.index", path: index_url) }
  before_action(:load_job_semaphore, only: %i[show edit update destroy delete])

  def index
    authorize(JobSemaphore)

    @job_semaphores = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def new
    @job_semaphore = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @job_semaphore = authorize(scope.new(job_semaphore_params))

    if @job_semaphore.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job_semaphore.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @job_semaphore.assign_attributes(job_semaphore_params)

    if @job_semaphore.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job_semaphore.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @job_semaphore.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @job_semaphore.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(JobSemaphore)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(JobSemaphore)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  private

  def load_job_semaphore
    @job_semaphore = authorize(scope.find(id))
    set_context(job_semaphore: @job_semaphore)
    add_breadcrumb(text: @job_semaphore, path: show_url)
  end

  def id
    params[:job_semaphore_id].presence || params[:id]
  end

  def scope
    searched_policy_scope(JobSemaphore)
  end

  def model_class
    JobSemaphore
  end

  def model_instance
    @job_semaphore
  end

  def nested
    []
  end

  def filters
    []
  end

  def job_semaphore_params
    admin? ? params.expect(job_semaphore: %i[key value expires_at]) : {}
  end
end
