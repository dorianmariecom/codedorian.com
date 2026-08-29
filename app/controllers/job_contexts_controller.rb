# frozen_string_literal: true

class JobContextsController < ApplicationController
  before_action(:load_guest)
  before_action(:load_user)
  before_action(:load_program)
  before_action(:load_job)
  before_action { add_breadcrumb(key: "job_contexts.index", path: index_url) }
  before_action(:load_job_context, only: %i[show edit update destroy delete])

  def index
      authorize(JobContext)

      @job_contexts = scope.page(params[:page]).order(created_at: :desc)

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @job_contexts
            }
          )
        end
      end
  end

  def show
      @versions = versions_scope.order(created_at: :desc).page(params[:page])
      @logs = logs_scope.order(created_at: :desc).page(params[:page])

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @job_context
            }
          )
        end
      end
  end

  def new
      @job_context = authorize(scope.new)

      add_breadcrumb

      respond_to do |format|
        format.html
        format.json do
          render(
            json: {
              status: :ok,
              messages: [],
              data: @job_context
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
              data: @job_context
            }
          )
        end
      end
  end

  def create
      @job_context = authorize(scope.new(job_context_params))

      if @job_context.save(context: :controller)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @job_context
              }
            )
          end
        end
      else
        flash.now.alert = @job_context.alert
        respond_to do |format|
          format.html { render(:new, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@job_context.alert],
                data: @job_context
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def update
      @job_context.assign_attributes(job_context_params)

      if @job_context.save(context: :controller)
        respond_to do |format|
          format.html { redirect_to(show_url, notice: t(".notice")) }
          format.json do
            render(
              json: {
                status: :ok,
                messages: [t(".notice")],
                data: @job_context
              }
            )
          end
        end
      else
        flash.now.alert = @job_context.alert
        respond_to do |format|
          format.html { render(:edit, status: :unprocessable_content) }
          format.json do
            render(
              json: {
                status: :unprocessable_content,
                messages: [@job_context.alert],
                data: @job_context
              },
              status: :unprocessable_content
            )
          end
        end
      end
  end

  def destroy
      @job_context.destroy!

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @job_context

            }
          )
        end
      end
  end

  def delete
      @job_context.delete

      respond_to do |format|
        format.html { redirect_to(index_url, notice: t(".notice")) }

        format.json do
          render(
            json: {

              status: :ok,

              messages: [t(".notice")],

              data: @job_context

            }
          )
        end
      end
  end

  def destroy_all
      authorize(JobContext)

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
      authorize(JobContext)

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

  def load_guest
    return if params[:guest_id].blank?

    @guest =
      if params[:guest_id] == "me"
        policy_scope(Guest).find(current_guest&.id)
      else
        policy_scope(Guest).find(params.expect(:guest_id))
      end

    set_context(guest: @guest)
    add_breadcrumb(key: "guests.index", path: :guests)
    add_breadcrumb(text: @guest, path: @guest)
  end

  def load_user
    return if params[:user_id].blank?

    @user =
      if params[:user_id] == "me"
        policy_scope(User).find(current_user&.id)
      else
        policy_scope(User).find(params.expect(:user_id))
      end

    set_context(user: @user)
    add_breadcrumb(key: "users.index", path: :users)
    add_breadcrumb(text: @user, path: @user)
  end

  def load_program
    return if params[:program_id].blank?

    @program = programs_scope.find(params.expect(:program_id))

    set_context(program: @program)
    add_breadcrumb(key: "programs.index", path: [@user, :programs])
    add_breadcrumb(text: @program, path: [@user, @program])
  end

  def load_job
    return if params[:job_id].blank?

    @job = jobs_scope.find(params.expect(:job_id))

    set_context(job: @job)
    add_breadcrumb(key: "jobs.index", path: [@user, :jobs])
    add_breadcrumb(text: @job, path: [@user, @job])
  end

  def id
    params[:job_context_id].presence || params[:id]
  end

  def scope
    scope = searched_policy_scope(JobContext)

    if @job
      scope = scope.where_job(@job)
    elsif @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def versions_scope
    scope = policy_scope(Version)

    scope = scope.where_job_context(@job_context) if @job_context

    scope
  end

  def programs_scope
    scope = policy_scope(Program)

    scope = scope.where_guest(@guest) if @guest
    scope = scope.where_user(@user) if @user

    scope
  end

  def jobs_scope
    scope = policy_scope(Job)

    if @program
      scope = scope.where_program(@program)
    elsif @user
      scope = scope.where_user(@user)
    elsif @guest
      scope = scope.where_guest(@guest)
    end

    scope
  end

  def logs_scope
    scope = policy_scope(Log)

    scope = scope.where_job_context(@job_context) if @job_context

    scope
  end

  def model_class
    JobContext
  end

  def model_instance
    @job_context
  end

  def nested(user: @user, guest: @guest, program: @program, job: @job)
    [user || guest, program, job].compact
  end

  def filters
    %i[user program job]
  end

  def load_job_context
    @job_context = authorize(scope.find(id))
    set_context(job_context: @job_context)
    add_breadcrumb(text: @job_context, path: show_url)
  end

  def job_context_params
    admin? ? params.expect(job_context: %i[active_job_id context]) : {}
  end
end
