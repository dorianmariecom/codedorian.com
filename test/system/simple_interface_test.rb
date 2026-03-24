# frozen_string_literal: true

require "application_system_test_case"

class SimpleInterfaceTest < ApplicationSystemTestCase
  test "simple user sees simplified account and messages" do
    user = users(:other_user)
    message = messages(:message)
    Current.with(user: users(:admin)) do
      message.update!(subject: "Simple title", body: "Simple content")
    end

    visit new_login_path

    fill_in "session_email_address",
            with: email_addresses(:other_email).email_address
    fill_in "session_password", with: passwords(:other_password).hint
    within("form") { click_button I18n.t("session.new.submit") }

    assert_current_path user_path(id: user)
    assert_text I18n.t("users.show.interface")
    assert_text I18n.t("users.model.interfaces.simple")
    assert_link I18n.t("users.show.messages")
    assert_no_text I18n.t("users.show.versions")
    assert_no_text I18n.t("users.show.logs")
    assert_no_text I18n.t("users.show.jobs")
    assert_no_link I18n.t("helpers.menu.programs")

    first(
      :link,
      I18n.t("users.show.messages"),
      href: user_messages_path(user_id: user)
    ).click

    assert_current_path user_messages_path(user_id: user)
    assert_no_link I18n.t("messages.index.new")
    assert_no_text I18n.t("messages.index.destroy_all")
    assert_text "Simple title"
    click_link "Simple title"

    assert_current_path user_message_path(user_id: user, id: message)
    assert_text "Simple title"
    assert_text "Simple content"
    assert_no_text I18n.t("messages.show.from_user")
    assert_no_text I18n.t("messages.show.to_user")
    assert_no_link I18n.t("messages.show.edit")
  end

  test "user can switch from simple to advanced" do
    user = users(:other_user)

    visit new_login_path

    fill_in "session_email_address",
            with: email_addresses(:other_email).email_address
    fill_in "session_password", with: passwords(:other_password).hint
    within("form") { click_button I18n.t("session.new.submit") }

    click_link I18n.t("users.show.edit")
    select I18n.t("users.model.interfaces.advanced"), from: "user_interface"
    within("form") { click_button I18n.t("users.edit.submit") }

    assert_current_path user_path(id: user)
    assert_text I18n.t("users.model.interfaces.advanced")
    assert_link I18n.t("helpers.menu.home")
    assert_link I18n.t("helpers.menu.about")
    assert_link I18n.t("helpers.menu.programs")
  end
end
