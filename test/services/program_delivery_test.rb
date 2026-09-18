# frozen_string_literal: true

require "test_helper"

class ProgramDeliveryTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  setup do
    stub_request(:get, %r{https://slack.com/api/conversations.list}).to_return(
      body: { ok: true, channels: [{ id: "C123", name: "general" }] }.to_json
    )
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
      @subscription.deliver!(
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
      @subscription.deliver!(
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
        @subscription.deliver!(
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
      @subscription.deliver!(
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
      @subscription.deliver!(
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

  test "ordinary saves and destination edits preserve deselected destinations" do
    removed = DeliveryDestination.create!(
      user: @subscription.user,
      delivery_channel: @channel,
      name: "Removed"
    )
    SubscriptionDeliveryBilling.select!(@subscription, [@destination.id, removed.id])
    SubscriptionDeliveryBilling.select!(@subscription, [@destination.id])

    assert @subscription.reload.save_with_delivery_destinations
    assert_equal [@destination.id], @subscription.subscription_destinations.selected.pluck(:delivery_destination_id)
    assert_equal [@destination.id], @subscription.delivery_destinations.ids

    @subscription.assign_attributes(
      delivery_destinations_attributes: [{ id: @destination.id, name: "Updated" }]
    )
    attributes = { delivery_destinations_attributes: [{ id: @destination.id, name: "Updated" }] }
    assert_not @subscription.confirm_delivery_changes?(attributes, nil)
    quoted_ids = @subscription.delivery_preview.fetch("items").map do |item|
      item.fetch("destination_id")
    end
    assert_equal [@destination.id], quoted_ids
    assert @subscription.save_with_delivery_destinations
    assert_equal [@destination.id], @subscription.subscription_destinations.selected.pluck(:delivery_destination_id)
    assert_not @subscription.subscription_destinations.find_by!(delivery_destination: removed).active?
    assert_equal 1050, @subscription.reload.amount_cents
  end

  test "nested edits cannot keep the old rate when switching channels" do
    channel = DeliveryChannel.create!(key: "push", enabled: true, amount_cents: 500)
    attributes = {
      delivery_destinations_attributes: [{ id: @destination.id, delivery_channel_id: channel.id }]
    }
    @subscription.reload.assign_attributes(attributes)
    assert_raises(StripeBilling::PricingError) do
      @subscription.confirm_delivery_changes?(attributes, nil)
    end
    assert_not @subscription.save_with_delivery_destinations
    assert_equal @channel, @destination.reload.delivery_channel
    assert_equal 1050, @subscription.reload.amount_cents
  end

  test "replacing a destination confirms and saves the new channel price" do
    channel = DeliveryChannel.create!(key: "push", enabled: true, amount_cents: 500)
    attributes = {
      delivery_destinations_attributes: [
        { id: @destination.id, _destroy: "1" },
        { delivery_channel_id: channel.id, name: "Push" }
      ]
    }.with_indifferent_access
    @subscription.reload.assign_attributes(attributes)
    assert_not @subscription.confirm_delivery_changes?(attributes, nil)
    assert_equal 500, @subscription.delivery_preview.fetch("items").sole.fetch("amount_cents")
    confirmation = @subscription.delivery_confirmation

    @subscription = Subscription.find(@subscription.id)
    @subscription.assign_attributes(attributes)
    assert @subscription.confirm_delivery_changes?(attributes, confirmation)
    assert @subscription.save_with_delivery_destinations, @subscription.errors.full_messages.to_sentence
    assert_equal 1500, @subscription.reload.amount_cents
    assert_equal 500, @subscription.subscription_destinations.selected.sole.amount_cents
    assert_equal channel, @subscription.delivery_destinations.sole.delivery_channel
  end

  test "connection secrets are encrypted at rest and versioned" do
    connection =
      DeliveryConnection.create!(
        user: users(:admin),
        name: "Slack",
        provider: "slack",
        access_token: "unique-test-secret"
      )
    assert_equal "unique-test-secret", connection.reload.access_token
    assert_not_includes connection.ciphertext_for(:access_token),
                        "unique-test-secret"
    assert_includes connection.to_json, "unique-test-secret"
    assert_not_includes connection.versions.to_json, "unique-test-secret"
    assert_includes connection.versions.to_json, "access_token"
  end

  test "Code exposes delivery with stable event key" do
    Current.subscription = @subscription
    result =
      Code.evaluate(
        'Current.subscription.deliver!(key: "code-event", subject: "Hello", body_text: "World")'
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
        recipient: "#general",
        name: "Slack"
      )
    assert_not destination.valid?
    assert_includes destination.errors.attribute_names, :delivery_connection
  end

  test "repeated worker rate limit rejections eventually fail" do
    delivery =
      @subscription.deliver!(
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
      @subscription.deliver!(
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
    assert_no_enqueued_jobs(only: DeliveryJob) { SchedulingJob.perform_now }
  end

  test "channel visibility flags default in the database and preserve explicit choices" do
    channel = DeliveryChannel.create!(key: "push")
    assert_not channel.reload.show_recipient?
    assert_not channel.show_visibility?

    @channel.update!(show_recipient: true, show_visibility: true)
    assert @channel.reload.show_recipient?
    assert @channel.show_visibility?
  end

  test "non admins cannot configure another users personal delivery connections" do
    Current.user = users(:other_user)
    assert_raises(Pundit::NotAuthorizedError) do
      DeliveryConnection.create!(
        user: users(:admin),
        name: "Slack",
        provider: "slack"
      )
    end
  end

  test "long event keys are preserved and deduplicated without a database index limit" do
    key = "event-#{SecureRandom.hex(10_000)}"
    deliveries = nil
    assert_difference "Delivery.count", 1 do
      2.times do
        deliveries =
          @subscription.deliver!(key: key, subject: "Hello", body_text: "World")
      end
    end
    assert_equal key, deliveries.sole.reload.event_key
    assert_equal Digest::SHA256.hexdigest(key), deliveries.sole.event_key_digest
  end

  test "creating delivery records does not enqueue external work" do
    assert_no_enqueued_jobs(only: DeliveryJob) do
      Delivery.create!(
        subscription: @subscription,
        delivery_destination: @destination,
        event_key: "manual"
      )
    end
  end

  test "scheduling marks interrupted workers uncertain without requeuing them" do
    delivery =
      @subscription.deliver!(
        key: "interrupted",
        subject: "Hello",
        body_text: "World"
      ).sole
    delivery.update!(status: :sending, updated_at: 20.minutes.ago)
    assert_no_enqueued_jobs(only: DeliveryJob) { SchedulingJob.perform_now }
    assert_equal "uncertain", delivery.reload.status
    assert_equal "worker_interrupted", delivery.error_code
    delivery.update!(status: :delivered)
    delivery.worker_interrupted!
    assert_predicate delivery.reload, :delivered?
  end

  test "deleting a channel removes its destinations and deliveries" do
    delivery =
      @subscription.deliver!(
        key: "delete",
        subject: "Hello",
        body_text: "World"
      ).sole
    @channel.destroy!
    assert_not DeliveryDestination.exists?(@destination.id)
    assert_not Delivery.exists?(delivery.id)
    assert_empty @subscription.subscription_destinations
  end

  test "deleting a connection clears associations" do
    connection = DeliveryConnection.create!(name: "Twilio", provider: :twilio)
    channel =
      DeliveryChannel.create!(key: :sms, delivery_connection: connection)
    connection.destroy!
    assert_nil channel.reload.delivery_connection_id
  end

  test "subscribed destinations cannot switch channels without a new priced selection" do
    channel =
      DeliveryChannel.create!(key: :push, enabled: true, amount_cents: 500)
    @destination.delivery_channel = channel
    assert_not @destination.save
    assert_includes @destination.errors.attribute_names, :delivery_channel
    assert_equal @channel, @destination.reload.delivery_channel
  end

  test "ordinary subscription edits preserve pending billing changes" do
    @subscription.update!(
      delivery_change_key: "pending-change",
      stripe_subscription_id: "sub_pending"
    )
    assert @subscription.save_with_delivery_destinations
    assert_equal "pending-change", @subscription.reload.delivery_change_key
  end

  test "legacy long-key digests survive status updates and deduplicate retries" do
    key = "legacy-#{SecureRandom.hex(200)}"
    digest = Digest::SHA256.hexdigest(key)
    delivery =
      Delivery.create!(
        subscription: @subscription,
        delivery_destination: @destination,
        event_key: "sha256:#{digest}"
      )
    delivery.update_column(:event_key_digest, digest)
    delivery.update!(status: :delivered)
    assert_equal digest, delivery.reload.event_key_digest
    assert_no_difference "Delivery.count" do
      assert_equal delivery,
                   @subscription.deliver!(
                     key: key,
                     subject: "Hello",
                     body_text: "World"
                   ).sole
    end
  end

  test "unverified email is canceled without replay while execution and pricing continue" do
    email_destination = select_email_destination
    amount = @subscription.reload.amount_cents
    deliveries = nil
    assert_enqueued_jobs 1, only: DeliveryJob do
      deliveries =
        @subscription.deliver!(
          key: "unverified",
          subject: "Hello",
          body_text: "World"
        )
    end
    skipped = deliveries.find { |delivery| delivery.channel == "email" }
    assert skipped.canceled?
    assert_equal "recipient_unverified", skipped.error_code
    assert @subscription.reload.active?
    assert_equal amount, @subscription.amount_cents
    SharedEmailVerification.confirm(
      email_destination,
      email_destination.verification_token
    )
    assert_no_enqueued_jobs only: DeliveryJob do
      @subscription.deliver!(
        key: "unverified",
        subject: "Hello",
        body_text: "World"
      )
    end
    assert skipped.reload.canceled?
    assert_equal 2,
                 @subscription.deliver!(
                   key: "next",
                   subject: "Hello",
                   body_text: "World"
                 ).size
    assert @subscription
             .deliveries
             .find_by!(event_key: "next", channel: "email")
             .pending?
  end

  test "claim cancels email after recipient changes even if the new recipient is verified" do
    destination = select_email_destination
    SharedEmailVerification.confirm(destination, destination.verification_token)
    delivery =
      @subscription
        .deliver!(key: "queued", subject: "Hello", body_text: "World")
        .find { |item| item.channel == "email" }
    destination.reload.update!(
      recipient: email_addresses(:admin_email).email_address
    )
    assert destination.recipient_verified?
    assert_not delivery.claim!
    assert_equal "recipient_unverified", delivery.reload.error_code
    assert delivery.canceled?
  end

  test "adapter rechecks verification after claim and cancels without submitting" do
    destination = select_email_destination
    SharedEmailVerification.confirm(destination, destination.verification_token)
    delivery =
      @subscription
        .deliver!(key: "claimed", subject: "Hello", body_text: "World")
        .find { |item| item.channel == "email" }
    assert delivery.claim!
    destination.reload.update!(recipient: "changed@example.com")
    assert_equal :canceled, DeliveryAdapters.deliver(delivery).status
    assert delivery.reload.canceled?
    assert_equal "recipient_unverified", delivery.error_code
  end

  private

  def select_email_destination
    connection =
      DeliveryConnection.create!(
        user: @subscription.user,
        name: "SMTP",
        provider: "smtp",
        smtp_from: "sender@example.com",
        smtp_address: "smtp.example.com"
      )
    channel =
      DeliveryChannel.create!(
        key: "email",
        enabled: true,
        amount_cents: 50,
        delivery_connection: connection
      )
    destination =
      DeliveryDestination.create!(
        user: @subscription.user,
        delivery_channel: channel,
        recipient: "unverified@example.com"
      )
    SubscriptionDeliveryBilling.select!(
      @subscription,
      [@destination.id, destination.id]
    )
    destination
  end

  def slack_delivery!(delivery)
    connection =
      DeliveryConnection.create!(
        user: @subscription.user,
        name: "Slack",
        provider: "slack",
        access_token: "test"
      )
    delivery.update!(
      channel: "slack",
      connection_id: connection.id,
      recipient: "#general"
    )
  end
end
