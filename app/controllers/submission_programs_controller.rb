# frozen_string_literal: true

class SubmissionProgramsController < ApplicationController
  before_action(:load_submission)
  before_action(:load_submission_section)
  before_action do
    add_breadcrumb(key: "submission_programs.index", path: index_url)
  end
  before_action(
    :load_submission_program,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(SubmissionProgram)

    @submission_programs = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @submission_program =
      authorize(scope.new(submission_section: @submission_section))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @submission_program = authorize(scope.new(submission_program_params))

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

    @submission = submissions_scope.find(params[:submission_id])

    set_context(submission: @submission)
    add_breadcrumb(key: "submissions.index", path: :submissions)
    add_breadcrumb(text: @submission, path: [@submission])
  end

  def load_submission_section
    return if params[:submission_section_id].blank?

    @submission_section =
      submission_sections_scope.find(params[:submission_section_id])

    set_context(submission_section: @submission_section)
    add_breadcrumb(
      text: @submission_section,
      path: [@submission, @submission_section].compact
    )
  end

  def scope
    scope = searched_policy_scope(SubmissionProgram)
    if @submission_section
      scope = scope.where_submission_section(@submission_section)
    end
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    if @submission_program
      scope = scope.where_submission_program(@submission_program)
    end
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    if @submission_program
      scope = scope.where_submission_program(@submission_program)
    end
    scope
  end

  def submission_sections_scope
    scope = policy_scope(SubmissionSection)
    scope = scope.where_submission(@submission) if @submission
    scope
  end

  def submissions_scope
    policy_scope(Submission)
  end

  def model_class
    SubmissionProgram
  end

  def model_instance
    @submission_program
  end

  def nested(submission: @submission, submission_section: @submission_section)
    [submission, submission_section].compact
  end

  def filters
    [:submission_section]
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
        submission_program: %i[submission_section_id locale name description]
      )
    else
      {}
    end
  end
end
