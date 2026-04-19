# frozen_string_literal: true

require "test_helper"

class ProgramExecutionsControllerTest < ActionDispatch::IntegrationTest
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

  smoke_actions_for "program_executions"

  test "advanced non admin user can create a program execution" do
    @other_user.update!(interface: :advanced)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_difference("ProgramExecution.count", 1) do
      post(
        user_program_program_executions_path(
          @other_user,
          programs(:other_program)
        ),
        params: {
          program_execution: {
            input: "puts('hello')",
            output: "hello\n",
            result: "nil",
            error: "",
            error_class: ""
          }
        }
      )
    end

    assert_redirected_to(
      user_program_program_execution_path(
        @other_user,
        programs(:other_program),
        ProgramExecution.order(:id).last
      )
    )
  end

  test "advanced non admin user can create a program execution from user page" do
    @other_user.update!(interface: :advanced)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_difference("ProgramExecution.count", 1) do
      post(
        user_program_executions_path(@other_user),
        params: {
          program_execution: {
            program_id: programs(:other_program).id,
            input: "puts('hello')",
            output: "hello\n",
            result: "nil",
            error: "",
            error_class: ""
          }
        }
      )
    end

    assert_redirected_to(
      user_program_execution_path(@other_user, ProgramExecution.order(:id).last)
    )
  end

  test "advanced non admin user cannot create a program execution for another user from nested route" do
    @other_user.update!(interface: :advanced)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_no_difference("ProgramExecution.count") do
      post(
        user_program_program_executions_path(@admin, programs(:program)),
        params: {
          program_execution: {
            input: "puts('hello')",
            output: "hello\n",
            result: "nil",
            error: "",
            error_class: ""
          }
        }
      )
    end

    assert_redirected_to(root_path)
  end

  test "advanced non admin user cannot create a program execution for another user by forging program id" do
    @other_user.update!(interface: :advanced)

    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_no_difference("ProgramExecution.count") do
      post(
        user_program_executions_path(@other_user),
        params: {
          program_execution: {
            program_id: programs(:program).id,
            input: "puts('hello')",
            output: "hello\n",
            result: "nil",
            error: "",
            error_class: ""
          }
        }
      )
    end

    assert_redirected_to(root_path)
  end

  test "admin can create a program execution for another user" do
    assert_difference("ProgramExecution.count", 1) do
      post(
        user_program_executions_path(@other_user),
        params: {
          program_execution: {
            program_id: programs(:other_program).id,
            status: "created",
            input: "puts('hello')",
            output: "hello\n",
            result: "nil",
            error: "",
            error_class: "",
            error_message: "",
            error_backtrace: ""
          }
        }
      )
    end

    assert_redirected_to(
      user_program_execution_path(@other_user, ProgramExecution.order(:id).last)
    )
  end
end
