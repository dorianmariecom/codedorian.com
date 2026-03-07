# frozen_string_literal: true

class FeedbackMailer < ApplicationMailer
  def feedback_email(feedback:)
    @feedback = feedback

    locale =
      @feedback.locale.to_s.presence_in(LOCALES_STRINGS) || I18n.default_locale

    I18n.with_locale(locale) do
      mail(
        to: "dorian@dorianmarie.com",
        subject: t(".subject", env: Current.env)
      )
    end
  end
end
