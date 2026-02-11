# frozen_string_literal: true

class SubmissionSectionsController < ApplicationController
  before_action(:load_submission)
  before_action do
    add_breadcrumb(key: "submission_sections.index", path: index_url)
  end
  before_action(
    :load_submission_section,
    only: %i[show edit update destroy delete]
  )

  def index
    authorize(SubmissionSection)

    @submission_sections = scope.page(params[:page]).order(created_at: :asc)
  end

  def show
    @submission_programs =
      submission_programs_scope.order(created_at: :asc).page(params[:page])
    @submission_schedules =
      submission_schedules_scope.order(created_at: :asc).page(params[:page])
    @submission_deliveries =
      submission_deliveries_scope.order(created_at: :asc).page(params[:page])
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @submission_section = authorize(scope.new(submission: @submission))

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @submission_section = authorize(scope.new(submission_section_params))

    if @submission_section.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @submission_section.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @submission_section.assign_attributes(submission_section_params)

    if @submission_section.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @submission_section.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @submission_section.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @submission_section.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(SubmissionSection)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(SubmissionSection)

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

  def scope
    scope = searched_policy_scope(SubmissionSection)
    scope = scope.where_submission(@submission) if @submission
    scope
  end

  def submission_programs_scope
    scope = policy_scope(SubmissionProgram)
    if @submission_section
      scope = scope.where_submission_section(@submission_section)
    end
    scope
  end

  def submission_schedules_scope
    scope = policy_scope(SubmissionSchedule)
    if @submission_section
      scope = scope.where_submission_section(@submission_section)
    end
    scope
  end

  def submission_deliveries_scope
    scope = policy_scope(SubmissionDelivery)
    if @submission_section
      scope = scope.where_submission_section(@submission_section)
    end
    scope
  end

  def versions_scope
    scope = policy_scope(Version)
    if @submission_section
      scope = scope.where_submission_section(@submission_section)
    end
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    if @submission_section
      scope = scope.where_submission_section(@submission_section)
    end
    scope
  end

  def submissions_scope
    policy_scope(Submission)
  end

  def model_class
    SubmissionSection
  end

  def model_instance
    @submission_section
  end

  def nested(submission: @submission)
    [submission].compact
  end

  def filters
    [:submission]
  end

  def id
    params[:submission_section_id].presence || params[:id]
  end

  def load_submission_section
    @submission_section = authorize(scope.find(id))
    set_context(submission_section: @submission_section)
    add_breadcrumb(text: @submission_section, path: show_url)
  end

  def submission_section_params
    if admin?
      params.expect(
        submission_section: %i[submission_id locale name description]
      )
    else
      {}
    end
  end
end
