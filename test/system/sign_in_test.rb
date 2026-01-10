# frozen_string_literal: true

require "application_system_test_case"

class SignInTest < ApplicationSystemTestCase
  test "sign in with email and password" do
    user = users(:admin)

    visit new_session_path

    fill_in "session_email_address",
            with: email_addresses(:admin_email).email_address
    fill_in "session_password", with: passwords(:password).hint
    within("form") { click_button I18n.t("sessions.new.submit") }

    assert_current_path "/users/#{user.id}"
  end
end
