# frozen_string_literal: true

require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
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

  smoke_actions_for "users"

  test "advanced non admin user show page lists linked resources" do
    @other_user.update!(interface: :advanced)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    get(user_path(@other_user))

    assert_response(:success)

    [
      user_names_path(@other_user),
      user_handles_path(@other_user),
      user_email_addresses_path(@other_user),
      user_phone_numbers_path(@other_user),
      user_addresses_path(@other_user),
      user_passwords_path(@other_user),
      user_time_zones_path(@other_user),
      user_devices_path(@other_user),
      user_tokens_path(@other_user),
      user_data_path(@other_user),
      user_messages_path(@other_user),
      user_programs_path(@other_user),
      user_program_executions_path(@other_user),
      user_program_schedules_path(@other_user)
    ].each do |path|
      assert_select("a[href='#{path}']")
    end

    [
      new_user_program_execution_path(@other_user),
      new_user_program_schedule_path(@other_user)
    ].each do |path|
      assert_select("a[href='#{path}']")
    end
  end

  test "simple non admin user show page lists devices" do
    @other_user.update!(interface: :simple)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    get(user_path(@other_user))

    assert_response(:success)

    assert_select("a[href='#{user_devices_path(@other_user)}']")
    assert_select("a[href='#{new_user_device_path(@other_user)}']", count: 0)
  end
end
