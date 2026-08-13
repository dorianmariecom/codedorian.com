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

  test "nested program show posts to the program scheduling actions" do
    program = programs(:program)

    get(user_program_path(@admin, program, locale: I18n.locale))

    assert_select(
      "form[action=?][method='post']",
      unschedule_user_program_path(@admin, program, locale: I18n.locale)
    )

    Current.with(user: @admin) { program.update!(scheduled: false) }
    get(user_program_path(@admin, program, locale: I18n.locale))

    assert_select(
      "form[action=?][method='post']",
      schedule_user_program_path(@admin, program, locale: I18n.locale)
    )
  end

  test "nested program scheduling actions update the program" do
    program = programs(:program)

    post(unschedule_user_program_path(@admin, program, locale: I18n.locale))
    assert_not(program.reload.scheduled?)

    post(schedule_user_program_path(@admin, program, locale: I18n.locale))
    assert_predicate(program.reload, :scheduled?)
  end
end
