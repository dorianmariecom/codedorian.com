# frozen_string_literal: true

class JobBatchesController < ApplicationController
  before_action { add_breadcrumb(key: "job_batches.index", path: index_url) }
  before_action(:load_job_batch, only: %i[show edit update destroy delete])

  def index
    authorize(JobBatch)

    @job_batches = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_batches })
      end
    end
  end

  def show
    @jobs =
      policy_scope(Job)
        .where(batch_id: @job_batch.id)
        .order(created_at: :desc)
        .page(params[:page])
    @batch_executions =
      policy_scope(JobBatchExecution)
        .where(batch_id: @job_batch.id)
        .order(created_at: :desc)
        .page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_batch })
      end
    end
  end

  def new
    @job_batch = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_batch })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_batch })
      end
    end
  end

  def create
    @job_batch = authorize(scope.new(job_batch_params))
    persist(:new, t(".notice"))
  end

  def update
    @job_batch.assign_attributes(job_batch_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @job_batch.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @job_batch.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(JobBatch)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(JobBatch)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_job_batch
    @job_batch = authorize(scope.find(id))
    set_context(job_batch: @job_batch)
    add_breadcrumb(text: @job_batch, path: show_url)
  end

  def id
    params[:job_batch_id].presence || params[:id]
  end

  def scope
    searched_policy_scope(JobBatch)
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_job_batch(@job_batch) if @job_batch
    scope
  end

  def model_class
    JobBatch
  end

  def model_instance
    @job_batch
  end

  def nested
    []
  end

  def filters
    []
  end

  def job_batch_params
    if admin?
      params.expect(
        job_batch: %i[
          active_job_batch_id
          description
          metadata
          total_jobs
          completed_jobs
          failed_jobs
          enqueued_at
          finished_at
          failed_at
        ]
      )
    else
      {}
    end
  end
end
