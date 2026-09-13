# frozen_string_literal: true

class EmailVerificationMailer < ApplicationMailer
  def confirmation(email_address:, url:)
    @url = url
    I18n.with_locale(params[:locale]) do
      mail(
        to: email_address,
        subject: t("email_verification_mailer.confirmation.subject")
      )
    end
  end
end
