# frozen_string_literal: true

require "test_helper"

class FacebookDeliveryControllerTest < ActionDispatch::IntegrationTest
  setup do
    @channel =
      Current.with(user: users(:admin)) do
        connection =
          DeliveryConnection.create!(
            provider: "facebook",
            name: "Facebook Page",
            sender: "123456",
            access_token: "private-page-token"
          )
        DeliveryChannel.create!(
          key: "facebook",
          visibility_restriction: "public",
          public_pattern: "(?:)",
          show_recipient: false,
          enabled: true,
          amount_cents: 0,
          delivery_connection: connection,
          show_visibility: true
        )
      end
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
  end

  test "destination and subscription forms show Facebook without exposing the page token" do
    [
      new_delivery_destination_path,
      new_service_subscription_path(
        services(:service),
        plan_id: plans(:plan).id
      )
    ].each do |path|
      get path
      assert_response :success
      assert_select "option[data-delivery-destination-form-visibility-restriction=public]",
                    minimum: 1
      assert_select "[data-delivery-destination-form-target=facebookHelp]",
                    count: 0
      assert_not_includes response.body, "private-page-token"
      assert_not_includes response.body, "translation missing"
    end
  end

  test "subscriber can create a public page destination but not a private one" do
    assert_difference "DeliveryDestination.count", 1 do
      post delivery_destinations_path,
           params: {
             delivery_destination: {
               delivery_channel_id: @channel.id,
               visibility: "public"
             }
           },
           as: :json
      assert_response :success
    end
    assert_difference "DeliveryDestination.count", 1 do
      post delivery_destinations_path,
           params: {
             delivery_destination: {
               delivery_channel_id: @channel.id,
               visibility: "private"
             }
           },
           as: :json
      assert_response :success
      assert_equal "public", DeliveryDestination.order(:id).last.visibility
    end
  end
end
