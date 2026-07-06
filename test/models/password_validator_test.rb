# frozen_string_literal: true

require "test_helper"

class PasswordValidatorTest < ActiveSupport::TestCase
  test "weak passwords return translated sequence messages" do
    result = PasswordValidator.check("password")

    assert_predicate(result, :failure?)
    assert_includes(
      result.message,
      I18n.t("password_validator.model.sequence.dictionary")
    )
  end

  test "strong passwords pass" do
    result = PasswordValidator.check("8fLwPq9zT2vXcM7n")

    assert_predicate(result, :success?)
  end
end
