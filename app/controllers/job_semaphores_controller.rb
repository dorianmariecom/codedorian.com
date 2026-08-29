# frozen_string_literal: true

class JobSemaphoresController < ApplicationController
  before_action { add_breadcrumb(key: "job_semaphores.index", path: index_url) }
  before_action(:load_job_semaphore, only: %i[show edit update destroy delete])

  def index
    authorize(JobSemaphore)

    @job_semaphores = scope.page(params[:page]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_semaphores })
      end
    end
  end

  def show
    @logs = logs_scope.order(created_at: :desc).page(params[:page])

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_semaphore })
      end
    end
  end

  def new
    @job_semaphore = authorize(scope.new)

    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_semaphore })
      end
    end
  end

  def edit
    add_breadcrumb

    respond_to do |format|
      format.html
      format.json do
        render(json: { status: :ok, messages: [], data: @job_semaphore })
      end
    end
  end

  def create
    @job_semaphore = authorize(scope.new(job_semaphore_params))

    if @job_semaphore.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @job_semaphore
            }
          )
        end
      end
    else
      flash.now.alert = @job_semaphore.alert
      respond_to do |format|
        format.html { render(:new, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@job_semaphore.alert],
              data: @job_semaphore
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def update
    @job_semaphore.assign_attributes(job_semaphore_params)

    if @job_semaphore.save(context: :controller)
      respond_to do |format|
        format.html { redirect_to(show_url, notice: t(".notice")) }
        format.json do
          render(
            json: {
              status: :ok,
              messages: [t(".notice")],
              data: @job_semaphore
            }
          )
        end
      end
    else
      flash.now.alert = @job_semaphore.alert
      respond_to do |format|
        format.html { render(:edit, status: :unprocessable_content) }
        format.json do
          render(
            json: {
              status: :unprocessable_content,
              messages: [@job_semaphore.alert],
              data: @job_semaphore
            },
            status: :unprocessable_content
          )
        end
      end
    end
  end

  def destroy
    @job_semaphore.destroy!

    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }

      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @job_semaphore
          }
        )
      end
    end
  end

  def delete
    @job_semaphore.delete

    respond_to do |format|
      format.html { redirect_to(index_url, notice: t(".notice")) }

      format.json do
        render(
          json: {
            status: :ok,
            messages: [t(".notice")],
            data: @job_semaphore
          }
        )
      end
    end
  end

  def destroy_all
    authorize(JobSemaphore)

    scope.destroy_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
  end

  def delete_all
    authorize(JobSemaphore)

    scope.delete_all

    respond_to do |format|
      format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

      format.json do
        render(json: { status: :ok, messages: [t(".notice")], data: nil })
      end
    end
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

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_job_semaphore(@job_semaphore) if @job_semaphore
    scope
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
