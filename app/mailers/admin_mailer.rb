# frozen_string_literal: true

class AdminMailer < ApplicationMailer
  def form_email
    @options = params[:options]
    @interval = params[:interval]
    @email_address = params[:email_address]

    mail(to: "dorian@dorianmarie.com", subject: t(".subject"))
  end
end
