# frozen_string_literal: true

require "test_helper"

class DevicesControllerTest < ActionDispatch::IntegrationTest
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

  test "authenticated non admin user can create a device" do
    user = users(:other_user)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_difference("user.devices.count", 1) do
      post(
        devices_path(format: :json),
        params: {
          device: {
            platform: "ios",
            token: "device-token-#{SecureRandom.hex(8)}"
          }
        }
      )
    end

    assert_response(:success)
  end

  test "authenticated non admin user cannot create a device for another user" do
    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_no_difference("Device.count") do
      post(
        user_devices_path(@admin),
        params: {
          device: {
            platform: "ios",
            token: "device-token-#{SecureRandom.hex(8)}"
          }
        }
      )
    end

    assert_redirected_to(root_path)
  end

  test "admin can create a device for another user" do
    assert_difference("Device.count", 1) do
      post(
        user_devices_path(@other_user),
        params: {
          device: {
            user_id: @other_user.id,
            platform: "ios",
            token: "device-token-#{SecureRandom.hex(8)}"
          }
        }
      )
    end

    assert_redirected_to(user_device_path(@other_user, Device.order(:id).last))
  end

  test "simple non admin user does not see device index actions" do
    @other_user.update!(interface: :simple)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    get(user_devices_path(@other_user))

    assert_response(:success)
    assert_select("a[href='#{new_user_device_path(@other_user)}']", count: 0)
    assert_select("form[action='#{destroy_all_user_devices_path(@other_user)}']", count: 0)
    assert_select("form[action='#{delete_all_user_devices_path(@other_user)}']", count: 0)
  end

  smoke_actions_for "devices"
end
