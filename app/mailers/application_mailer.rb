# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: "dorian@dorianmarie.com"
  layout "mailer"
end
