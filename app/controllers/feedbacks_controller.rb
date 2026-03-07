# frozen_string_literal: true

class FeedbacksController < ApplicationController
  before_action { add_breadcrumb(key: "feedbacks.index", path: index_url) }
  before_action(:load_feedback, only: %i[show edit update destroy delete])

  def index
    authorize(Feedback)

    @feedbacks = scope.page(params[:page]).order(created_at: :desc)
  end

  def show
  end

  def new
    @feedback = authorize(scope.new)
    add_breadcrumb
  end

  def edit
    add_breadcrumb
  end

  def create
    @feedback = authorize(scope.new(feedback_params))

    if @feedback.save(context: :controller)
      FeedbackMailer.feedback_email(feedback: @feedback).deliver_later
      redirect_to(admin? ? show_url : %i[new feedback], notice: t(".notice"))
    else
      flash.now.alert = @feedback.alert
      render(:new, status: :unprocessable_content)
    end
  end

  def update
    @feedback.assign_attributes(feedback_params)

    if @feedback.save(context: :controller)
      redirect_to(show_url, notice: t(".notice"))
    else
      flash.now.alert = @feedback.alert
      render(:edit, status: :unprocessable_content)
    end
  end

  def destroy
    @feedback.destroy!

    redirect_to(index_url, notice: t(".notice"))
  end

  def delete
    @feedback.delete

    redirect_to(index_url, notice: t(".notice"))
  end

  def destroy_all
    authorize(Feedback)
    scope.destroy_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  def delete_all
    authorize(Feedback)
    scope.delete_all

    redirect_back_or_to(index_url, notice: t(".notice"))
  end

  private

  def scope
    searched_policy_scope(Feedback)
  end

  def model_class
    Feedback
  end

  def model_instance
    @feedback
  end

  def nested
    []
  end

  def filters
    []
  end

  def id
    params[:feedback_id].presence || params[:id]
  end

  def load_feedback
    @feedback = authorize(scope.find(id))
    set_context(feedback: @feedback)
    add_breadcrumb(text: @feedback, path: show_url)
  end

  def feedback_params
    if admin?
      params.expect(
        feedback: %i[user_id guest_id message locale path ip user_agent]
      )
    else
      params.expect(feedback: [:message])
    end
  end
end
