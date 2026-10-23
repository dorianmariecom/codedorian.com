# frozen_string_literal: true

require "test_helper"

class DeliveryChannelProgramTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @subscription = subscriptions(:subscription)
    @channel =
      DeliveryChannel.create!(key: "messages", enabled: true, amount_cents: 0)
    @destination =
      DeliveryDestination.create!(
        user: @subscription.user,
        delivery_channel: @channel
      )
    SubscriptionDeliveryBilling.select!(@subscription, [@destination.id])
    @delivery =
      Delivery.create!(
        subscription: @subscription,
        delivery_destination: @destination,
        event_key: "program",
        subject: "hello",
        body_text: "world",
        locale: "fr"
      )
  end

  teardown { Current.reset }

  test "delivery idempotency keys are stable and available to programs" do
    Current.delivery = @delivery
    expected = Digest::SHA256.hexdigest("delivery-#{@delivery.id}")
    assert_equal expected, @delivery.idempotency_key
    @channel.update!(delivery_input: "Delivery.accepted(delivery.idempotency_key)")
    assert_equal expected, @channel.deliver(delivery: @delivery).provider_id
    assert_equal expected, @delivery.reload.idempotency_key
  end

  test "delivery visibility predicates are available to programs" do
    @channel.update!(delivery_input: "Delivery.accepted(delivery.public?.to_string)")
    @delivery.update!(visibility: "public")
    assert_equal "true", @channel.deliver(delivery: @delivery).provider_id
    @channel.update!(delivery_input: "Delivery.accepted(delivery.private?.to_string)")
    assert_equal "false", @channel.deliver(delivery: @delivery).provider_id
    @delivery.visibility = "private"
    assert_equal "true", @channel.deliver(delivery: @delivery).provider_id
    assert_equal "public", @delivery.reload.visibility
  end

  test "saved programs execute as the service user and restore context" do
    @channel.update!(delivery_input: <<~CODE)
      { status: "accepted", provider_id: "{Current.user.id}:{Current.subscription.id}:{Current.locale}" }
    CODE
    Current.user = users(:other_user)
    Current.locale = "en"
    result = @channel.deliver(delivery: @delivery)
    assert_equal "#{@subscription.service.user_id}:#{@subscription.id}:fr",
                 result.provider_id
    assert_equal users(:other_user), Current.user
    assert_equal "en", Current.locale
    assert_nil Current.delivery
    assert_nil Current.subscription
  end

  test "non admin service users execute without elevation" do
    owner = users(:other_user)
    @subscription.service.update!(user: owner)
    @subscription = Subscription.create!(user: owner, plan: plans(:plan))
    destination =
      DeliveryDestination.create!(user: owner, delivery_channel: @channel)
    @delivery =
      Delivery.create!(
        subscription: @subscription,
        delivery_destination: destination,
        event_key: "owner",
        subject: "hello",
        body_text: "world"
      )
    @channel.update!(
      delivery_input:
        '{ status: "accepted", provider_id: Current.user.id.to_string }'
    )
    assert_equal owner.id.to_s,
                 @channel.deliver(delivery: @delivery).provider_id
    assert_equal users(:admin), Current.user
  end

  test "service users cannot read another users connection credentials" do
    connection =
      Connection.create!(
        user: users(:admin),
        provider: "github",
        access_token: "secret"
      )
    owner = users(:other_user)
    @subscription.service.update!(user: owner)
    @subscription = Subscription.create!(user: owner, plan: plans(:plan))
    destination =
      DeliveryDestination.create!(user: owner, delivery_channel: @channel)
    @delivery =
      Delivery.create!(
        subscription: @subscription,
        delivery_destination: destination,
        event_key: "owner",
        subject: "hello",
        body_text: "world"
      )
    @delivery.update!(connection: connection, channel: "github")
    @channel.update!(
      delivery_input:
        '{ status: "accepted", provider_id: connection.access_token }'
    )
    assert_raises(ActiveRecord::RecordNotFound) do
      @channel.deliver(delivery: @delivery)
    end
    assert_equal users(:admin), Current.user
    assert_nil Current.delivery
  end

  test "new channels have no implicit program" do
    assert_nil @channel.reload.delivery_input
    error =
      assert_raises(DeliveryChannel::Rejected) do
        @channel.deliver(delivery: @delivery)
      end
    assert_equal "configuration_missing", error.code
  end

  test "invalid results and evaluation failures leave claimed deliveries uncertain" do
    [
      "nothing",
      '{ status: "pending" }',
      '{ status: "delivered", provider_id: 1 }',
      '{ status: "rejected", error_code: "bad", retryable: "yes" }',
      "unknown_delivery_function()"
    ].each do |input|
      @channel.update!(delivery_input: input)
      @delivery.update!(status: "pending", next_attempt_at: nil)
      assert_raises(IOError, Code::Error) do
        DeliveryJob.perform_now(delivery_id: @delivery.id)
      end
      assert_equal "uncertain", @delivery.reload.status
      assert_equal users(:admin), Current.user
      assert_nil Current.delivery
    end
  end

  test "structured rejection results use existing retry handling" do
    @channel.update!(
      delivery_input:
        '{ status: "rejected", error_code: "http_429", retryable: true }'
    )
    DeliveryJob.perform_now(delivery_id: @delivery.id)
    assert_equal "pending", @delivery.reload.status
    assert_equal "http_429", @delivery.error_code
    assert_equal 1, @delivery.attempts
    assert @delivery.next_attempt_at.future?
  end

  test "migration fills missing programs and preserves subsequent edits" do
    migration = PopulateDeliveryInputs.new
    migration.suppress_messages { migration.up }
    assert_equal delivery_input_for("messages"), @channel.reload.delivery_input
    @channel.update!(delivery_input: '{ status: "accepted" }')
    migration.suppress_messages { migration.up }
    assert_equal '{ status: "accepted" }', @channel.reload.delivery_input
    PopulateDeliveryInputs.programs.each_value do |input|
      assert Code.parse(input)
    end
  end

  test "explicit uncertainty is persisted without raising or resending" do
    @channel.update!(delivery_input: "Delivery.uncertain")
    assert_nothing_raised { DeliveryJob.perform_now(delivery_id: @delivery.id) }
    assert_equal "uncertain", @delivery.reload.status
    assert_equal 1, @delivery.attempts
    DeliveryJob.perform_now(delivery_id: @delivery.id)
    assert_equal 1, @delivery.reload.attempts
  end
end
