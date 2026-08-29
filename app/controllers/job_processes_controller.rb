# frozen_string_literal: true

class JobProcessesController < ApplicationController
  before_action { add_breadcrumb(key: "job_processes.index", path: index_url) }
  before_action(:load_job_process, only: %i[show edit update destroy delete])

  def index
      authorize(JobProcess)

      @job_processes = scope.page(params[:page]).order(created_at: :desc)

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @job_processes
            }
          )
        end
      end
  end

  def show
      @logs = logs_scope.order(created_at: :desc).page(params[:page])

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @job_process
            }
          )
        end
      end
  end

  def new
      @job_process = authorize(scope.new)

      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @job_process
            }
          )
        end
      end
  end

  def edit
      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @job_process
            }
          )
        end
      end
  end

  def create
      @job_process = authorize(scope.new(job_process_params))

      if @job_process.save(context: :controller)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @job_process
              }
            )
          end
        end
      else
        flash.now.alert = @job_process.alert
        respond_to do |format|
          format.html { render(:new, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@job_process.alert],
                data: @job_process
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def update
      @job_process.assign_attributes(job_process_params)

      if @job_process.save(context: :controller)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @job_process
              }
            )
          end
        end
      else
        flash.now.alert = @job_process.alert
        respond_to do |format|
          format.html { render(:edit, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@job_process.alert],
                data: @job_process
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def destroy
      @job_process.destroy!

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @job_process

            }
          )
        end
      end
  end

  def delete
      @job_process.delete

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @job_process

            }
          )
        end
      end
  end

  def destroy_all
      authorize(JobProcess)

      scope.destroy_all

      respond_to do |format|
        format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: nil

            }
          )
        end
      end
  end

  def delete_all
      authorize(JobProcess)

      scope.delete_all

      respond_to do |format|
        format.html { redirect_back_or_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: nil

            }
          )
        end
      end
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

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_job_process(@job_process) if @job_process
    scope
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
