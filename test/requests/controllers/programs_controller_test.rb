# frozen_string_literal: true

require "test_helper"

class ProgramsControllerTest < ActionDispatch::IntegrationTest
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

  smoke_actions_for "programs"

  test "advanced non admin user cannot create a program for another user" do
    @other_user.update!(interface: :advanced)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_no_difference("Program.count") do
      post(
        user_programs_path(@admin),
        params: {
          program: {
            name: "Cross User Program",
            input: "puts('hello')"
          }
        }
      )
    end

    assert_redirected_to(root_path)
  end

  test "admin can create a program for another user" do
    assert_difference("Program.count", 1) do
      post(
        user_programs_path(@other_user),
        params: {
          program: {
            user_id: @other_user.id,
            name: "Admin Program",
            input: "puts('hello')"
          }
        }
      )
    end

    assert_redirected_to(
      user_program_path(@other_user, Program.order(:id).last)
    )
  end
end
