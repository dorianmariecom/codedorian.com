# frozen_string_literal: true

class FormsController < ApplicationController
  before_action { authorize :form }
  before_action { add_breadcrumb(key: "forms.show", path: index_url) }

  def show
    @submission = scope.new
    if @submission.submission_sections.empty?
      @submission.submission_sections.build
    end
    @form_programs = form_programs_scope.order(:position)
    @form_schedules = form_schedules_scope.order(:position)
    @form_deliveries = form_deliveries_scope.order(:position)
  end

  def create
    @submission = scope.new(submission_params)

    if @submission.save(context: :controller)
      perform_later(
        FormEmailJob,
        arguments: {
          submission: @submission
        },
        context: {
          submission: @submission
        },
        current: {
        }
      )
      redirect_to(root_path, notice: t(".notice"))
    else
      if @submission.submission_sections.empty?
        @submission.submission_sections.build
      end
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
                ],
                submission_schedules_attributes: [
                  %i[_destroy form_schedule_id value]
                ],
                submission_deliveries_attributes: [
                  %i[_destroy form_delivery_id value]
                ]
              }
            ]
          ]
        }
      ]
    )
  end
end
