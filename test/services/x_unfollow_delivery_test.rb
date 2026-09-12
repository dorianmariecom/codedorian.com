# frozen_string_literal: true

require "test_helper"

class XUnfollowDeliveryTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @subscription = subscriptions(:subscription)
    Current.subscription = @subscription
    channel =
      DeliveryChannel.create!(key: "messages", enabled: true, amount_cents: 0)
    destination =
      DeliveryDestination.create!(
        user: @subscription.user,
        delivery_channel: channel,
        name: "Inbox"
      )
    SubscriptionDeliveryBilling.select!(@subscription, [destination.id])
  end

  teardown { Current.reset }

  test "follower refresh queues one alert for lost followers and deduplicates retries" do
    input = <<~CODE
      subscription = Current.subscription
      subscription_key = subscription.id.to_string
      x_username = "example"
      followers_by_subscription = {}.set(subscription_key, [{ id: "1" }, { id: "2" }])
      followers = [{ id: "2" }]
    CODE
    input += Rails.root.join("config/delivery/x_unfollows.code").read
    assert_difference "Delivery.count", 1 do
      2.times { Code.evaluate(input) }
    end
    delivery = @subscription.deliveries.sole
    assert_includes delivery.payload.fetch("body_text"),
                    "https://x.com/i/user/1"
    assert_not_includes delivery.payload.fetch("body_text"),
                        "https://x.com/i/user/2"
  end

  test "initial follower refresh does not send an alert" do
    input = <<~CODE
      subscription = Current.subscription
      subscription_key = subscription.id.to_string
      x_username = "example"
      followers_by_subscription = {}
      followers = [{ id: "2" }]
    CODE
    input += Rails.root.join("config/delivery/x_unfollows.code").read
    assert_no_difference "Delivery.count" do
      Code.evaluate(input)
    end
  end
end
