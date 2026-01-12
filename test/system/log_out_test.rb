# frozen_string_literal: true

require "application_system_test_case"

class LogOutTest < ApplicationSystemTestCase
  test "log out from user page" do
    user = users(:other_user)

    visit new_login_path

    fill_in "session_email_address",
            with: email_addresses(:other_email).email_address
    fill_in "session_password", with: passwords(:other_password).hint
    within("form") { click_button I18n.t("session.new.submit") }

    assert_current_path "/users/#{user.id}"

    click_button I18n.t("users.show.log_out")

    assert_current_path root_path
    assert_selector("a", text: I18n.t("static.home.log_in"))
  end
end
