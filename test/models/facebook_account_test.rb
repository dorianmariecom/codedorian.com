# frozen_string_literal: true

require "test_helper"

class FacebookAccountTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @connection = DeliveryConnection.create!(provider: "messenger", name: "Page", sender: "123", access_token: "token")
    @channel = DeliveryChannel.create!(key: "messenger", enabled: true, amount_cents: 0, delivery_connection: @connection)
    @subscription = subscriptions(:subscription)
    @account = FacebookAccount.create!(user: @subscription.user, name: "Alice", facebook_id: "456", messenger_page_id: "123", messenger_recipient_id: "789", messenger_status: "ready")
  end

  teardown { Current.reset }

  test "destinations enforce account ownership and page mapping" do
    destination = DeliveryDestination.new(user: @subscription.user, delivery_channel: @channel, facebook_account: @account)
    assert destination.valid?, destination.errors.full_messages.join(", ")
    assert_equal "789", destination.recipient
    destination.user = users(:other_user)
    assert_not destination.valid?
    destination.user = @subscription.user
    @account.messenger_page_id = "999"
    assert_not destination.valid?
    @account.messenger_page_id = "123"
    @account.enabled = false
    assert_not destination.valid?
  end

  test "queued deliveries snapshot the account and stop after disconnect or recipient change" do
    destination = DeliveryDestination.create!(user: @subscription.user, delivery_channel: @channel, facebook_account: @account)
    delivery = Delivery.create!(subscription: @subscription, delivery_destination: destination, event_key: "account")
    assert_equal @account, delivery.facebook_account
    assert delivery.recipient_verified_for_delivery?
    @account.update!(enabled: false)
    assert_not delivery.recipient_verified_for_delivery?
    @account.update!(enabled: true, messenger_recipient_id: "999")
    assert_not delivery.recipient_verified_for_delivery?
    @account.update!(messenger_recipient_id: "789")
    @connection.update!(sender: "999")
    assert_not delivery.recipient_verified_for_delivery?
  end
end
