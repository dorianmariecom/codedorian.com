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

  test "guest registration creates primary credentials without a hint and preserves the destination" do
    delete(login_path)
    destination = services_path
    get(new_user_path(redirect_to: destination))

    assert_response(:success)
    assert_select("form[action='#{users_path}']") do
      assert_select("input:not([type=hidden]):not([type=submit])", count: 2)
      assert_select("input[type=email][required]", count: 1)
      assert_select("input[type=password][required]", count: 1)
      assert_select("select, input[type=checkbox]", count: 0)
      assert_select("input[type=submit][value=?]", I18n.t("users.registration.submit"))
    end

    assert_difference("User.count", 1) do
      post(users_path, params: {
             redirect_to: destination,
        user: {
          locale: I18n.locale,
          email_addresses_attributes: {
            "0" => { email_address: "registration@example.com", primary: "true" }
          },
          passwords_attributes: {
            "0" => { password: "registration-password", primary: "true" }
          }
        }
           })
    end

    assert_redirected_to(destination)
    user = User.order(:id).last
    assert_equal(I18n.locale.to_s, user.locale)
    assert_predicate(user, :simple?)
    assert_equal(1, user.email_addresses.count)
    assert_predicate(user.email_addresses.first, :primary?)
    assert_equal(1, user.passwords.count)
    assert_predicate(user.passwords.first, :primary?)
    assert_predicate(user.passwords.first.hint, :blank?)
    assert(user.passwords.first.authenticate("registration-password"))
    assert_empty(user.phone_numbers)
  end

  test "invalid guest registration keeps both simple fields" do
    delete(login_path)
    post(users_path, params: {
           user: {
             email_addresses_attributes: { "0" => { email_address: "invalid" } },
             passwords_attributes: { "0" => { password: "" } }
           }
         })

    assert_response(:unprocessable_content)
    assert_select("input[type=email][value=invalid]", count: 1)
    assert_select("input[type=password][required]", count: 1)
    assert_select("input[name*='[hint]'], select[name='user[interface]']", count: 0)
  end

  test "invalid create renders validation errors without setting an unsaved current user" do
    post(
      users_path,
      params: {
        user: {
          locale: :en,
          interface: :simple,
          email_addresses_attributes: {
            "0" => {
              email_address: "invalid",
              primary: "1"
            }
          }
        }
      }
    )

    assert_response(:unprocessable_content)
  end

  test "advanced non admin user show page lists linked resources" do
    Current.with(user: @admin) do
      @other_user.update!(interface: :advanced, stripe_customer_id: "cus_other")
    end

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    get(user_path(@other_user))

    assert_response(:success)
    assert_select(
      ".text-gray-600",
      text: I18n.t("users.show.stripe_customer_id")
    )
    assert_select(".font-bold", text: "cus_other")

    [
      user_names_path(@other_user),
      user_handles_path(@other_user),
      user_email_addresses_path(@other_user),
      user_phone_numbers_path(@other_user),
      user_addresses_path(@other_user),
      user_countries_path(@other_user),
      user_passwords_path(@other_user),
      user_time_zones_path(@other_user),
      user_devices_path(@other_user),
      user_tokens_path(@other_user),
      user_data_path(@other_user),
      user_messages_path(@other_user),
      user_programs_path(@other_user),
      user_program_executions_path(@other_user),
      user_program_schedules_path(@other_user)
    ].each { |path| assert_select("a[href='#{path}']") }

    [
      new_user_program_execution_path(@other_user),
      new_user_program_schedule_path(@other_user)
    ].each { |path| assert_select("a[href='#{path}']") }
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
