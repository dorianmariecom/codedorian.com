# frozen_string_literal: true

class FormMailer < ApplicationMailer
  def summary_email(submission:, to:, reply_to: nil)
    return if to.blank?

    @submission = submission
    @sections =
      submission
        .submission_sections
        .includes(
          :submission_programs,
          :submission_schedules,
          :submission_deliveries
        )
        .order(:created_at, :id)

    I18n.with_locale(submission.locale) do
      mail(
        to: to.presence,
        reply_to: reply_to.presence,
        subject: "[#{Current.translated_env}] #{submission}"
      )
    end
  end
end
