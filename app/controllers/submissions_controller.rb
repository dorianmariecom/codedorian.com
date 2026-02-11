# frozen_string_literal: true

class SubmissionsController < ApplicationController
  before_action { add_breadcrumb(key: "submissions.index", path: index_url) }
  before_action(:load_submission, only: %i[show edit update destroy delete])

  def index
    authorize(Submission)

    @submissions = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
    @submission_sections =
      submission_sections_scope.order(created_at: :asc).page(params[:page])
    @versions = versions_scope.order(created_at: :desc).page(params[:page])
    @logs = logs_scope.order(created_at: :desc).page(params[:page])
  end

  def new
    @submission = authorize(scope.new)

    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @submission = authorize(scope.new(submission_params))

    if @submission.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @submission.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @submission.assign_attributes(submission_params)

    if @submission.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @submission.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @submission.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @submission.delete

    redirect_to(
      index_url,
      notice: t(".notice", default: t("#{controller_name}.destroy.notice"))
    )
  end

  def destroy_all
    authorize(Submission)

    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Submission)

    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope
    searched_policy_scope(Submission)
  end

  def versions_scope
    scope = policy_scope(Version)
    scope = scope.where_submission(@submission) if @submission
    scope
  end

  def logs_scope
    scope = policy_scope(Log)
    scope = scope.where_submission(@submission) if @submission
    scope
  end

  def submission_sections_scope
    scope = policy_scope(SubmissionSection)
    scope = scope.where_submission(@submission) if @submission
    scope
  end

  def model_class
    Submission
  end

  def model_instance
    @submission
  end

  def nested
    []
  end

  def filters
    []
  end

  def id
    params[:submission_id].presence || params[:id]
  end

  def load_submission
    @submission = authorize(scope.find(id))
    set_context(submission: @submission)
    add_breadcrumb(text: @submission, path: show_url)
  end

  def submission_params
    if admin?
      params.expect(
        submission: %i[given_name family_name email_address phone_number locale]
      )
    else
      {}
    end
  end
end
