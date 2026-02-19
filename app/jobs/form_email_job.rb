# frozen_string_literal: true

class FormEmailJob < ContextJob
  def perform_with_context(submission:)
    I18n.with(locale: submission.locale) do
      FormMailer.summary_email(
        submission: submission,
        to: "dorian@dorianmarie.com",
        reply_to: submission.email_address,
        locale: locale
      )&.deliver_later

      FormMailer.summary_email(
        submission: submission,
        to: submission.email_address,
        locale: locale
      )&.deliver_later
    end
  end
end
