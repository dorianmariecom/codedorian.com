# frozen_string_literal: true

require "test_helper"

class DeliveryChannelConfigurationTest < ActiveSupport::TestCase
  setup { Current.user = users(:admin) }
  teardown { Current.reset }

  test "database visibility and patterns control destination validation" do
    channel =
      DeliveryChannel.create!(
        key: "messages",
        visibility_restriction: "public",
        show_recipient: true,
        public_pattern: "#[a-z]+",
        private_pattern: "@[a-z]+"
      )
    destination =
      DeliveryDestination.new(
        delivery_channel: channel,
        recipient: "#hello",
        visibility: "private"
      )
    assert destination.valid?
    assert_equal "public", destination.visibility
    destination.recipient = "@hello"
    assert_not destination.valid?
    channel.reload.update!(visibility_restriction: nil)
    destination.visibility = "private"
    assert destination.valid?
    channel.reload.update!(private_pattern: "[0-9]+")
    assert_not destination.valid?
    destination.recipient = "123"
    assert destination.valid?
  end

  test "optional recipients and invalid channel patterns are handled explicitly" do
    channel =
      DeliveryChannel.new(
        key: "messages",
        show_recipient: true,
        public_pattern: "(@[a-z]+)?",
        private_pattern: "@[a-z]+"
      )
    assert_not channel.recipient_required?("public")
    assert channel.recipient_required?("private")
    channel.private_pattern = "["
    assert_not channel.valid?
    channel.private_pattern = nil
    channel.visibility_restriction = ""
    assert channel.valid?
    assert_nil channel.visibility_restriction
  end

  test "messenger uses a regular recipient and shared delivery connection" do
    connection =
      DeliveryConnection.create!(
        provider: "messenger",
        name: "Page",
        sender: "123",
        access_token: "token"
      )
    channel =
      DeliveryChannel.create!(
        key: "messenger",
        visibility_restriction: "private",
        private_pattern: "[0-9]+",
        delivery_connection: connection,
        enabled: true,
        amount_cents: 0,
        show_recipient: true
      )
    destination =
      DeliveryDestination.create!(
        user: subscriptions(:subscription).user,
        delivery_channel: channel,
        recipient: "789"
      )
    delivery =
      Delivery.create!(
        subscription: subscriptions(:subscription),
        delivery_destination: destination,
        event_key: "messenger"
      )
    assert_equal "789", delivery.recipient
    assert_equal connection, delivery.connection
    assert delivery.recipient_verified_for_delivery?
    assert destination.available?
    connection.destroy!
    assert_not destination.reload.available?
    assert_nil channel.reload.delivery_connection
  end

  test "deleting a personal connection leaves its destinations unavailable" do
    connection =
      DeliveryConnection.create!(
        provider: "slack",
        name: "Slack",
        access_token: "token"
      )
    channel =
      DeliveryChannel.create!(key: "slack", enabled: true, amount_cents: 0)
    destination =
      DeliveryDestination.create!(
        delivery_channel: channel,
        delivery_connection: connection,
        recipient: "#hello"
      )
    assert destination.available?
    connection.destroy!
    assert_nil destination.reload.delivery_connection
    assert_not destination.available?
  end
end
