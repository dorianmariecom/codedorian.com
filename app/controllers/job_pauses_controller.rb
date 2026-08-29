# frozen_string_literal: true

class JobPausesController < ApplicationController
  before_action { add_breadcrumb(key: "job_pauses.index", path: index_url) }
  before_action(:load_job_pause, only: %i[show edit update destroy delete])

  def index
    authorize(JobPause)

    @job_pauses = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_pauses })
      end
    end
  end

  def show
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_pause })
      end
    end
  end

  def new
    @job_pause = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_pause })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_pause })
      end
    end
  end

  def create
    @job_pause = authorize(scope.new(job_pause_params))
    persist(:new, t(".notice"))
  end

  def update
    @job_pause.assign_attributes(job_pause_params)
    persist(:edit, t(".notice"))
  end

  def destroy
    @job_pause.destroy!
    respond_after_delete(t(".notice"))
  end

  def delete
    @job_pause.delete
    respond_after_delete(t(".notice"))
  end

  def destroy_all
    authorize(JobPause)

    scope.destroy_all
    respond_after_delete_all(t(".notice"))
  end

  def delete_all
    authorize(JobPause)

    scope.delete_all
    respond_after_delete_all(t(".notice"))
  end

  private

  def load_job_pause
    @job_pause = authorize(scope.find(id))
    set_context(job_pause: @job_pause)
    add_breadcrumb(text: @job_pause, path: show_url)
  end

  def id
    params[:job_pause_id].presence || params[:id]
  end

  def scope
    searched_policy_scope(JobPause)
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_job_pause(@job_pause) if @job_pause
    scope
  end

  def model_class
    JobPause
  end

  def model_instance
    @job_pause
  end

  def nested
    []
  end

  def filters
    []
  end

  def job_pause_params
    admin? ? params.expect(job_pause: %i[queue_name]) : {}
  end
end
