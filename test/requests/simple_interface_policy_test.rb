# frozen_string_literal: true

require "test_helper"

class SimpleInterfacePolicyTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:other_user)
    @message = messages(:message)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
  end

  test "simple user cannot open message edit screen" do
    get edit_user_message_path(user_id: @user, id: @message)

    assert_redirected_to root_path
  end

  test "simple user cannot open programs index" do
    get user_programs_path(user_id: @user)

    assert_redirected_to root_path
  end
end
