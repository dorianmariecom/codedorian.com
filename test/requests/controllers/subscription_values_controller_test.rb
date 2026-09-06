# frozen_string_literal: true

require "test_helper"

class SubscriptionValuesControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    @subscription_value = subscription_values(:phone)
  end

  %i[destroy delete].each do |action|
    test "admin can #{action} a subscription value through its confirmation form" do
      get(subscription_value_path(@subscription_value))

      assert_response(:success)
      path =
        public_send(
          "subscription_value_#{action}_path",
          subscription_value_id: @subscription_value
        )
      assert_select("form[action=?]", path) do
        assert_select("input[name='_method'][value='delete']")
      end

      assert_difference("SubscriptionValue.count", -1) { delete(path) }

      assert_redirected_to(subscription_values_path)
      assert_not(SubscriptionValue.exists?(@subscription_value.id))
    end
  end

  test "admin can destroy a subscription value through the REST route" do
    assert_difference("SubscriptionValue.count", -1) do
      delete(subscription_value_path(@subscription_value))
    end

    assert_redirected_to(subscription_values_path)
  end
end
