# frozen_string_literal: true

class SessionMailer < ApplicationMailer
  def magic_link(email_address:, url:)
    @url = url
    mail(to: email_address, subject: t("session_mailer.magic_link.subject"))
  end
end
