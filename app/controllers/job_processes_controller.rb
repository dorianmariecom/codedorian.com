# frozen_string_literal: true

class JobProcessesController < ApplicationController
  before_action { add_breadcrumb(key: "job_processes.index", path: index_url) }
  before_action(:load_job_process, only: %i[show edit update destroy delete])

  def index
    authorize(JobProcess)

    @job_processes = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def new
    @job_process = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @job_process = authorize(scope.new(job_process_params))

    if @job_process.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job_process.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @job_process.assign_attributes(job_process_params)

    if @job_process.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @job_process.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @job_process.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @job_process.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(JobProcess)

    scope.destroy_all

    redirect_back_or_to(index_url)
  end

  def delete_all
    authorize(JobProcess)

    scope.delete_all

    redirect_back_or_to(index_url)
  end

  private

  def load_job_process
    @job_process = authorize(scope.find(id))
    set_context(job_process: @job_process)
    add_breadcrumb(text: @job_process, path: show_url)
  end

  def id
    params[:job_process_id].presence || params[:id]
  end

  def scope
    searched_policy_scope(JobProcess)
  end

  def model_class
    JobProcess
  end

  def model_instance
    @job_process
  end

  def nested
    []
  end

  def filters
    []
  end

  def job_process_params
    if admin?
      params.expect(
        job_process: %i[
          hostname
          kind
          last_heartbeat_at
          metadata
          name
          pid
          supervisor_id
        ]
      )
    else
      {}
    end
  end
end
