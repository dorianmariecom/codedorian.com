# frozen_string_literal: true

require "test_helper"

class ProgramDeliveryTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  setup do
    Current.user = users(:admin)
    @subscription = subscriptions(:subscription)
    @channel =
      DeliveryChannel.create!(key: "messages", enabled: true, amount_cents: 50)
    @destination =
      DeliveryDestination.create!(
        user: @subscription.user,
        delivery_channel: @channel,
        name: "Inbox"
      )
    SubscriptionDeliveryBilling.select!(@subscription, [@destination.id])
  end

  teardown { Current.reset }

  test "reset never resends an uncertain or delivered delivery" do
    delivery =
      @subscription.deliver(
        key: "reset",
        subject: "Hello",
        body_text: "World"
      ).sole
    delivery.update!(status: "uncertain")
    assert_no_enqueued_jobs(only: DeliveryJob) { delivery.reset! }
    assert_equal "uncertain", delivery.reload.status
    delivery.update!(status: "delivered")
    assert_no_enqueued_jobs(only: DeliveryJob) { delivery.reset! }
    assert_equal "delivered", delivery.reload.status
  end

  test "reconciliation only changes uncertain deliveries and defaults to failed" do
    delivery =
      @subscription.deliver(
        key: "reconcile",
        subject: "Hello",
        body_text: "World"
      ).sole
    delivery.reconcile!("delivered")
    assert_equal "pending", delivery.reload.status
    delivery.update!(status: "uncertain")
    delivery.reconcile!("invalid")
    assert_equal "failed", delivery.reload.status
    assert_equal "manually_reconciled", delivery.error_code
  end

  test "generates independent deliveries once per destination and event" do
    second =
      DeliveryDestination.create!(
        user: @subscription.user,
        delivery_channel: @channel,
        name: "Second inbox"
      )
    SubscriptionDeliveryBilling.select!(
      @subscription,
      [@destination.id, second.id]
    )
    assert_difference "Delivery.count", 2 do
      2.times do
        @subscription.deliver(
          key: "event-1",
          subject: "Hello",
          body_text: "World"
        )
      end
    end
    assert_equal 1100, @subscription.reload.amount_cents
    assert_equal 2, @subscription.delivery_pricing.fetch("items").size
  end

  test "inbox job creates a message only once" do
    delivery =
      @subscription.deliver(
        key: "event-1",
        subject: "Hello",
        body_text: "World"
      ).sole
    assert_difference "Message.count", 1 do
      2.times { DeliveryJob.perform_now(delivery_id: delivery.id) }
    end
    assert_equal "delivered", delivery.reload.status
  end

  test "removed destination cancels queued delivery" do
    delivery =
      @subscription.deliver(
        key: "event-1",
        subject: "Hello",
        body_text: "World"
      ).sole
    @subscription.subscription_destinations.sole.update!(
      selected: false,
      active: false
    )
    assert_no_difference "Message.count" do
      DeliveryJob.perform_now(delivery_id: delivery.id)
    end
    assert_equal "canceled", delivery.reload.status
  end

  test "another users destination cannot be selected" do
    other =
      DeliveryDestination.create!(
        user: users(:other_user),
        delivery_channel: @channel,
        name: "Other"
      )
    assert_raises(StripeBilling::PricingError) do
      SubscriptionDeliveryBilling.select!(@subscription, [other.id])
    end
    assert_equal [@destination.id],
                 @subscription
                   .subscription_destinations
                   .where(selected: true)
                   .pluck(:delivery_destination_id)
  end

  test "disabled or unpriced channels cannot be selected" do
    @channel.update!(amount_cents: nil)
    assert_raises(StripeBilling::PricingError) do
      SubscriptionDeliveryBilling.select!(@subscription, [@destination.id])
    end
  end

  test "rate changes do not silently reprice existing selections" do
    @channel.update!(amount_cents: 500)
    SubscriptionDeliveryBilling.select!(@subscription, [@destination.id])
    assert_equal 1050, @subscription.reload.amount_cents
  end

  test "connection secrets are encrypted and absent from JSON and versions" do
    connection =
      DeliveryConnection.create!(
        user: users(:admin),
        name: "Slack",
        provider: "slack",
        credentials: {
          access_token: "unique-test-secret"
        }
      )
    assert_equal "unique-test-secret",
                 connection.reload.credentials["access_token"]
    assert_not_includes connection.encrypted_credentials, "unique-test-secret"
    assert_not_includes connection.to_json, "encrypted_credentials"
    assert_not_includes connection.versions.to_json, "unique-test-secret"
    assert_not_includes connection.versions.to_json, "encrypted_credentials"
  end

  test "Code exposes delivery with stable event key" do
    Current.subscription = @subscription
    result =
      Code.evaluate(
        'Current.subscription.deliver(key: "code-event", subject: "Hello", body_text: "World")'
      )
    assert_equal 1, result.as_json.size
    assert_equal "code-event", @subscription.deliveries.sole.event_key
  end

  test "private social delivery cannot use another users connection" do
    channel =
      DeliveryChannel.create!(key: "slack", enabled: true, amount_cents: 0)
    connection =
      DeliveryConnection.create!(
        user: users(:other_user),
        name: "Other",
        provider: "slack"
      )
    destination =
      DeliveryDestination.new(
        user: @subscription.user,
        delivery_channel: channel,
        delivery_connection: connection,
        recipient: "C123",
        name: "Slack"
      )
    assert_not destination.valid?
    assert_includes destination.errors.attribute_names, :delivery_connection
  end

  test "repeated worker rate limit rejections eventually fail" do
    delivery =
      @subscription.deliver(
        key: "event-1",
        subject: "Hello",
        body_text: "World"
      ).sole
    slack_delivery!(delivery)
    stub_request(:post, "https://slack.com/api/chat.postMessage").to_return(
      status: 429
    )
    5.times do
      delivery.update!(next_attempt_at: nil)
      DeliveryJob.perform_now(delivery_id: delivery.id)
      delivery.reload
    end
    assert_equal "failed", delivery.status
    assert_equal 5, delivery.attempts
  end

  test "uncertain provider outcomes are never automatically resent" do
    delivery =
      @subscription.deliver(
        key: "event-1",
        subject: "Hello",
        body_text: "World"
      ).sole
    slack_delivery!(delivery)
    stub_request(:post, "https://slack.com/api/chat.postMessage").to_raise(
      Net::ReadTimeout
    )
    assert_raises(Net::ReadTimeout) do
      DeliveryJob.perform_now(delivery_id: delivery.id)
    end
    assert_equal "uncertain", delivery.reload.status
    assert_no_enqueued_jobs(only: DeliveryJob) do
      DispatchPendingDeliveriesJob.perform_now
    end
  end

  test "channel visibility flags default in the database and preserve explicit choices" do
    channel = DeliveryChannel.create!(key: "push")
    assert_not channel.reload.show_recipient?
    assert_not channel.show_visibility?

    @channel.update!(show_recipient: true, show_visibility: true)
    assert @channel.reload.show_recipient?
    assert @channel.show_visibility?
  end

  test "non admins cannot configure personal delivery connections" do
    Current.user = users(:other_user)
    assert_raises(Pundit::NotAuthorizedError) do
      DeliveryConnection.create!(
        user: users(:other_user),
        name: "Slack",
        provider: "slack"
      )
    end
  end

  private

  def slack_delivery!(delivery)
    connection =
      DeliveryConnection.create!(
        user: @subscription.user,
        name: "Slack",
        provider: "slack",
        credentials: {
          access_token: "test"
        }
      )
    delivery.update!(
      destination_snapshot:
        delivery.destination_snapshot.merge(
          "channel" => "slack",
          "connection_id" => connection.id,
          "recipient" => "C123"
        )
    )
  end
end
