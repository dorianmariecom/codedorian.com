# frozen_string_literal: true

class FormsController < ApplicationController
  before_action { authorize(:form) }
  skip_after_action(:verify_policy_scoped)

  def show
    add_breadcrumb
  end

  def create
    @options = ((params.dig(:form, :option) || []) - ["0"])
    @interval = params.dig(:form, :interval)
    @email_address = params.dig(:form, :email_address)

    AdminMailer
      .with(
        options: @options,
        interval: @interval,
        email_address: @email_address
      )
      .form_email
      .deliver_later

    redirect_back_or_to(:form, notice: t(".notice"))
  end
end
