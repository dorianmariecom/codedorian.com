# frozen_string_literal: true

require "test_helper"

class PasswordsCheckTest < ActionDispatch::IntegrationTest
  test "check returns validation json for weak passwords" do
    post(check_passwords_path, params: { password: "password" }, as: :json)

    assert_response(:success)
    assert_equal(false, response.parsed_body["success"])
    assert_includes(
      response.parsed_body["message"],
      I18n.t("password_validator.model.sequence.dictionary")
    )
  end

  test "check returns validation json for strong passwords" do
    post(
      check_passwords_path,
      params: {
        password: "8fLwPq9zT2vXcM7n"
      },
      as: :json
    )

    assert_response(:success)
    assert_equal(true, response.parsed_body["success"])
  end
end
