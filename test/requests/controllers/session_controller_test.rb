# frozen_string_literal: true

require "test_helper"

class SessionControllerTest < ActionDispatch::IntegrationTest
  include ControllerSmokeHelper

  setup do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  smoke_actions_for "session"
end
