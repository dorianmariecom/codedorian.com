# frozen_string_literal: true

class SubmissionProgramsController < ApplicationController
  before_action(:load_submission)
  before_action do
    add_breadcrumb(key: "submission_programs.index", path: index_url)
  end
  before_action(
    :load_submission_program,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(SubmissionProgram)

    @submission_programs = scope.page(params[:page]).order(position: :asc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @submission_program = authorize(scope.new(submission: @submission))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    attributes = submission_program_params
    attributes[:submission] = @submission if @submission
    @submission_program = authorize(scope.new(attributes))

    if @submission_program.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @submission_program.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @submission_program.assign_attributes(submission_program_params)

    if @submission_program.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @submission_program.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @submission_program.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @submission_program.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(SubmissionProgram)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(SubmissionProgram)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def load_submission
    return if params[:submission_id].blank?

    @submission = policy_scope(Submission).find(params[:submission_id])

    set_context(submission: @submission)
    add_breadcrumb(key: "submissions.index", path: :submissions)
    add_breadcrumb(text: @submission, path: @submission)
  end

  def scope
    scope = searched_policy_scope(SubmissionProgram)
    scope = scope.where_submission(@submission) if @submission
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    if @submission_program
      scope =
        scope.where_submission_program(@submission_program)
    end
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    if @submission_program
      scope =
        scope.where_submission_program(@submission_program)
    end
    scope
  end

  def model_class
    SubmissionProgram
  end

  def model_instance
    @submission_program
  end

  def nested(submission: @submission)
    [submission]
  end

  def filters
    [:submission]
  end

  def id
    params[:submission_program_id].presence || params[:id]
  end

  def load_submission_program
    @submission_program = authorize(scope.find(id))
    set_context(submission_program: @submission_program)
    add_breadcrumb(text: @submission_program, path: show_url)
  end

  def submission_program_params
    if admin?
      params.expect(
        submission_program: %i[
          submission_id
          form_schedule_id
          form_program_id
          form_delivery_id
          name
          description
          position
          form_program_name
          form_program_description
          form_schedule_starts_at
          form_schedule_interval
          form_schedule_name
          form_schedule_description
          form_delivery_name
          form_delivery_description
        ]
      )
    else
      {}
    end
  end
end
