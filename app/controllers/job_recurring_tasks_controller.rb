# frozen_string_literal: true

class JobRecurringTasksController < ApplicationController
  before_action do
    add_breadcrumb(key: "job_recurring_tasks.index", path: index_url)
  end
  before_action(
    :load_job_recurring_task,
    only: %i[show edit update destroy delete]
  )

  def index
      authorize(JobRecurringTask)

      @job_recurring_tasks = scope.page(params[:page]).order(created_at: :desc)

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @job_recurring_tasks
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
              data: @job_recurring_task
            }
          )
        end
      end
  end

  def new
      @job_recurring_task = authorize(scope.new)

      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @job_recurring_task
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
              data: @job_recurring_task
            }
          )
        end
      end
  end

  def create
      @job_recurring_task = authorize(scope.new(job_recurring_task_params))

      if @job_recurring_task.save(context: :controller)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @job_recurring_task
              }
            )
          end
        end
      else
        flash.now.alert = @job_recurring_task.alert
        respond_to do |format|
          format.html { render(:new, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@job_recurring_task.alert],
                data: @job_recurring_task
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def update
      @job_recurring_task.assign_attributes(job_recurring_task_params)

      if @job_recurring_task.save(context: :controller)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @job_recurring_task
              }
            )
          end
        end
      else
        flash.now.alert = @job_recurring_task.alert
        respond_to do |format|
          format.html { render(:edit, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@job_recurring_task.alert],
                data: @job_recurring_task
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def destroy
      @job_recurring_task.destroy!

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @job_recurring_task

            }
          )
        end
      end
  end

  def delete
      @job_recurring_task.delete

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @job_recurring_task

            }
          )
        end
      end
  end

  def destroy_all
      authorize(JobRecurringTask)

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
      authorize(JobRecurringTask)

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

  def load_job_recurring_task
    @job_recurring_task = authorize(scope.find(id))
    set_context(job_recurring_task: @job_recurring_task)
    add_breadcrumb(text: @job_recurring_task, path: show_url)
  end

  def id
    params[:job_recurring_task_id].presence || params[:id]
  end

  def scope
    searched_policy_scope(JobRecurringTask)
  end

  def logs_scope
    scope = policy_scope(Log)
    if @job_recurring_task
      scope = scope.where_job_recurring_task(@job_recurring_task)
    end
    scope
  end

  def model_class
    JobRecurringTask
  end

  def model_instance
    @job_recurring_task
  end

  def nested
    []
  end

  def filters
    []
  end

  def job_recurring_task_params
    if admin?
      params.expect(
        job_recurring_task: %i[
          key
          class_name
          command
          schedule
          queue_name
          priority
          static
          arguments
          description
        ]
      )
    else
      {}
    end
  end
end
