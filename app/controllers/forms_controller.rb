# frozen_string_literal: true

class FormsController < ApplicationController
  before_action { authorize :form }
  before_action { add_breadcrumb(key: "forms.show", path: index_url) }

  def show
    @submission =
      scope.new(
        given_name: "dorian",
        family_name: "marié",
        email_address: "dorian@dorianmarie.com",
        phone_number: "+33767239573"
      )
    @form_programs = form_programs_scope.order(:position)
    @form_schedules = form_schedules_scope.order(:position)
    @form_deliveries = form_deliveries_scope.order(:position)
  end

  def create
    @submission = scope.new(submission_params)

    if @submission.save(context: :controller)
      # redirect_to(root_path, notice: t(".notice"))
      redirect_to(@submission, notice: t(".notice"))
    else
      @form_programs = form_programs_scope.order(:position)
      @form_schedules = form_schedules_scope.order(:position)
      @form_deliveries = form_deliveries_scope.order(:position)
      flash.now.alert = @submission.alert
      render(:show, status: :unprocessable_content)
    end
  end

  private

  def scope
    searched_policy_scope(Submission)
  end

  def form_programs_scope
    policy_scope(FormProgram)
  end

  def form_schedules_scope
    policy_scope(FormSchedule)
  end

  def form_deliveries_scope
    policy_scope(FormDelivery)
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

  def submission_params
    params.expect(
      submission: [
        :email_address,
        :family_name,
        :given_name,
        :phone_number,
        {
          submission_sections_attributes: [
            [
              :_destroy,
              :name,
              :description,
              {
                submission_programs_attributes: [
                  %i[_destroy form_program_id value]
                ]
              }
            ]
          ]
        }
      ]
    )
  end
end
