# frozen_string_literal: true

require "test_helper"

class ProgramSchedulesControllerTest < ActionDispatch::IntegrationTest
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

  smoke_actions_for "program_schedules"

  test "advanced non admin user can create a program schedule" do
    @other_user.update!(interface: :advanced)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_difference("ProgramSchedule.count", 1) do
      post(
        user_program_program_schedules_path(
          @other_user,
          programs(:other_program)
        ),
        params: {
          program_schedule: {
            starts_at: Time.zone.parse("2026-04-19 09:00:00"),
            interval: "1 day"
          }
        }
      )
    end

    assert_redirected_to(
      user_program_program_schedule_path(
        @other_user,
        programs(:other_program),
        ProgramSchedule.order(:id).last
      )
    )
  end

  test "advanced non admin user can create a program schedule from user page" do
    @other_user.update!(interface: :advanced)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_difference("ProgramSchedule.count", 1) do
      post(
        user_program_schedules_path(@other_user),
        params: {
          program_schedule: {
            program_id: programs(:other_program).id,
            starts_at: Time.zone.parse("2026-04-19 09:00:00"),
            interval: "1 day"
          }
        }
      )
    end

    assert_redirected_to(
      user_program_schedule_path(@other_user, ProgramSchedule.order(:id).last)
    )
  end

  test "advanced non admin user cannot create a program schedule for another user from nested route" do
    @other_user.update!(interface: :advanced)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_no_difference("ProgramSchedule.count") do
      post(
        user_program_program_schedules_path(@admin, programs(:program)),
        params: {
          program_schedule: {
            starts_at: Time.zone.parse("2026-04-19 09:00:00"),
            interval: "1 day"
          }
        }
      )
    end

    assert_redirected_to(root_path)
  end

  test "advanced non admin user cannot create a program schedule for another user by forging program id" do
    @other_user.update!(interface: :advanced)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_no_difference("ProgramSchedule.count") do
      post(
        user_program_schedules_path(@other_user),
        params: {
          program_schedule: {
            program_id: programs(:program).id,
            starts_at: Time.zone.parse("2026-04-19 09:00:00"),
            interval: "1 day"
          }
        }
      )
    end

    assert_redirected_to(root_path)
  end

  test "admin can create a program schedule for another user" do
    assert_difference("ProgramSchedule.count", 1) do
      post(
        user_program_schedules_path(@other_user),
        params: {
          program_schedule: {
            program_id: programs(:other_program).id,
            starts_at: Time.zone.parse("2026-04-19 09:00:00"),
            interval: "1 day"
          }
        }
      )
    end

    assert_redirected_to(
      user_program_schedule_path(@other_user, ProgramSchedule.order(:id).last)
    )
  end
end
