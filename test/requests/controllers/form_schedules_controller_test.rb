# frozen_string_literal: true

require "test_helper"

class FormSchedulesControllerTest < ActionDispatch::IntegrationTest
  include ControllerSmokeHelper

  setup do
    @admin = users(:admin)
    @guest = guests(:guest)
    @other_user = users(:other_user)
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  smoke_actions_for "form_schedules"
end
