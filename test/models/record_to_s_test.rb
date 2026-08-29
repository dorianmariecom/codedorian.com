# frozen_string_literal: true

require "test_helper"

class RecordToSTest < ActiveSupport::TestCase
  teardown { Current.reset }

  test "admins see the translated record id after the descriptive sample" do
    user = users(:other_user)
    Current.user = users(:admin)

    assert_equal(
      Utils.join(user.description_sample, user.t("to_s", id: user.id)),
      user.to_s
    )
  end

  test "non admins do not see the record id" do
    user = users(:other_user)
    Current.user = user

    assert_equal(user.description_sample, user.to_s)
  end

  test "record fields replace users and precede the record id" do
    program = programs(:other_program)
    Current.user = users(:admin)

    assert_equal(
      Utils.join(program.name_sample, program.t("to_s", id: program.id)),
      program.to_s
    )
  end

  test "users are used when record fields are blank" do
    program = programs(:other_program)
    program.name = nil
    program.input = nil
    Current.user = users(:admin)

    assert_equal(
      Utils.join(program.user_sample, program.t("to_s", id: program.id)),
      program.to_s
    )
  end

  test "the translated record id remains the fallback" do
    guest = guests(:guest)
    Current.user = users(:other_user)

    assert_equal(guest.t("to_s", id: guest.id), guest.to_s)
  end
end
