# frozen_string_literal: true

require "test_helper"

class DeliveryAdminControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  test "admin CRUD forms render for every delivery resource" do
    [
      new_delivery_connection_path,
      new_delivery_channel_path,
      new_delivery_destination_path,
      new_subscription_destination_path,
      new_delivery_path
    ].each do |path|
      get path
      assert_response :success
      assert_select "form"
    end
  end

  test "admin can create a channel without configuring its price" do
    post delivery_channels_path,
         params: {
           delivery_channel: {
             key: "messages",
             enabled: false
           }
         }
    channel = DeliveryChannel.find_by!(key: "messages")
    assert_redirected_to delivery_channel_path(channel)
    get delivery_channel_path(channel)
    assert_response :success
    assert_not channel.available?
  end

  test "delivery JSON endpoints reset and reconcile through the model" do
    Current.user = users(:admin)
    channel =
      DeliveryChannel.create!(key: "messages", enabled: true, amount_cents: 0)
    destination =
      DeliveryDestination.create!(
        user: subscriptions(:subscription).user,
        delivery_channel: channel
      )
    delivery =
      Delivery.create!(
        subscription: subscriptions(:subscription),
        delivery_destination: destination,
        event_key: "review",
        status: "failed",
        attempts: 5,
        error_code: "error",
        next_attempt_at: 1.hour.from_now
      )

    get deliveries_path, as: :json
    assert_response :success
    assert_includes response.parsed_body.fetch("data").pluck("id"), delivery.id
    get delivery_path(delivery), as: :json
    assert_response :success
    assert_equal delivery.id, response.parsed_body.fetch("data").fetch("id")

    post retry_delivery_path(delivery), as: :json
    assert_response :success
    assert_equal "pending", delivery.reload.status
    assert_equal 0, delivery.attempts
    assert_nil delivery.error_code
    assert_nil delivery.next_attempt_at

    delivery.update!(status: "uncertain")
    post reconcile_delivery_path(delivery),
         params: {
           outcome: "delivered"
         },
         as: :json
    assert_response :success
    assert_equal "delivered", delivery.reload.status
    assert_equal "manually_reconciled", delivery.error_code
  end

  test "channel forms and deletions support JSON and invalid HTML renders the form" do
    get new_delivery_channel_path, as: :json
    assert_response :success
    post delivery_channels_path,
         params: {
           delivery_channel: {
             key: "invalid"
           }
         }
    assert_response :unprocessable_content
    assert_select "form"

    channel = DeliveryChannel.create!(key: "messages")
    get edit_delivery_channel_path(channel), as: :json
    assert_response :success
    delete delivery_channel_path(channel), as: :json
    assert_response :success
    assert_not DeliveryChannel.exists?(channel.id)
  end

  test "destination audit history uses the resource context and paginates" do
    Current.user = users(:admin)
    channel = DeliveryChannel.create!(key: "messages")
    destination =
      DeliveryDestination.create!(
        user: users(:admin),
        delivery_channel: channel
      )
    log =
      Log.create!(
        message: "Delivery review audit",
        context: {
          delivery_destination: {
            id: destination.id
          }
        }
      )
    assert_includes Log.where_delivery_destination(destination), log
    assert_includes Version.where_delivery_destination(destination).pluck(
                      :item_id
                    ),
                    destination.id
    get delivery_destination_path(destination)
    assert_response :success
    assert_select "a[href=?]",
                  log_path(log, delivery_destination_id: destination.id)
    get delivery_destination_path(destination), params: { page: 2 }
    assert_response :success
    assert_select "a[href=?]",
                  log_path(log, delivery_destination_id: destination.id),
                  count: 0
  end
end
