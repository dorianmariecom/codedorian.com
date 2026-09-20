# frozen_string_literal: true

require "test_helper"

class SubscriptionDeliveryBillingTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    @subscription = subscriptions(:subscription)
    channel =
      DeliveryChannel.create!(key: "messages", enabled: true, amount_cents: 50)
    @first =
      DeliveryDestination.create!(
        user: @subscription.user,
        delivery_channel: channel
      )
    @second =
      DeliveryDestination.create!(
        user: @subscription.user,
        delivery_channel: channel
      )
    SubscriptionDeliveryBilling.select!(@subscription, [@first.id])
    @subscription.update!(
      stripe_subscription_id: "sub_delivery",
      stripe_status: "active"
    )
    stub_request(:post, "https://api.stripe.com/v1/prices").to_return(
      status: 200,
      body: { id: "price_new", object: "price" }.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )
  end

  teardown { Current.reset }

  test "unchanged quotes accept destinations in a different order" do
    @subscription.update!(stripe_subscription_id: nil)
    SubscriptionDeliveryBilling.select!(@subscription, [@first.id, @second.id])
    quote = @subscription.reload.delivery_pricing
    quote["items"].reverse!

    SubscriptionDeliveryBilling.select!(
      @subscription,
      [@second.id, @first.id],
      expected_quote: quote
    )

    assert_equal 1100, @subscription.reload.amount_cents
    assert_equal 2, @subscription.subscription_destinations.selected.count
  end

  test "changed prices still reject the quote and roll back selections" do
    @subscription.update!(stripe_subscription_id: nil)
    @subscription.delivery_destinations << @second
    @subscription.subscription_destinations.find_by!(
      delivery_destination: @second
    ).update!(selected: false)
    quote = SubscriptionDeliveryBilling.preview(@subscription)
    @second.delivery_channel.update!(amount_cents: 75)

    assert_raises(StripeBilling::PricingError) do
      SubscriptionDeliveryBilling.select!(
        @subscription,
        [@first.id, @second.id],
        expected_quote: quote
      )
    end

    assert_equal 1050, @subscription.reload.amount_cents
    assert_not @subscription.subscription_destinations.find_by!(
      delivery_destination: @second
    ).selected?
  end

  test "unpaid additions remain inactive until matching pending update completes" do
    stub_remote(amount: 1050)
    update = stub_update(amount: 1050, pending: { expires_at: 12_345 })
    SubscriptionDeliveryBilling.select!(@subscription, [@first.id, @second.id])
    assert_requested update
    assert_not @subscription
                 .subscription_destinations
                 .find_by!(delivery_destination: @second)
                 .active?
    assert @subscription.reload.delivery_change_key.present?
    SubscriptionDeliveryBilling.confirm!(@subscription, remote(amount: 1100))
    assert @subscription
             .subscription_destinations
             .find_by!(delivery_destination: @second)
             .active?
    assert_nil @subscription.reload.delivery_change_key
    assert_equal 1100, @subscription.amount_cents
  end

  test "mismatched billing confirmations cannot activate additions" do
    stub_remote(amount: 1050)
    stub_update(amount: 1050, pending: { expires_at: 12_345 })
    SubscriptionDeliveryBilling.select!(@subscription, [@first.id, @second.id])
    SubscriptionDeliveryBilling.confirm!(@subscription, remote(amount: 9999))
    assert_not @subscription
                 .subscription_destinations
                 .find_by!(delivery_destination: @second)
                 .active?
  end

  test "removals stop immediately and do not create prorated refunds" do
    @subscription.update!(stripe_subscription_id: nil)
    SubscriptionDeliveryBilling.select!(@subscription, [@first.id, @second.id])
    @subscription.update!(stripe_subscription_id: "sub_delivery")
    stub_remote(amount: 1100)
    update =
      stub_update(amount: 1050).with do |request|
        URI.decode_www_form(request.body).to_h["proration_behavior"] == "none"
      end
    SubscriptionDeliveryBilling.select!(@subscription, [@first.id])
    assert_requested update
    selection =
      @subscription.subscription_destinations.find_by!(
        delivery_destination: @second
      )
    assert_not selection.active?
    assert_not selection.selected?
    assert_equal 1050, @subscription.reload.amount_cents
  end

  test "provider failures preserve a retryable billing change without activating additions" do
    stub_remote(amount: 1050)
    stub_request(
      :post,
      "https://api.stripe.com/v1/subscriptions/sub_delivery"
    ).to_return(
      status: 400,
      body: {
        error: {
          message: "Declined",
          type: "invalid_request_error"
        }
      }.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )
    assert_raises(Stripe::StripeError) do
      SubscriptionDeliveryBilling.select!(
        @subscription,
        [@first.id, @second.id]
      )
    end
    assert @subscription.reload.delivery_change_key.present?
    assert_not @subscription
                 .subscription_destinations
                 .find_by!(delivery_destination: @second)
                 .active?
  end

  test "billing updates survive unavailable selected destinations" do
    @first.update!(enabled: false)
    @subscription.reload.billing_inactive!
    assert @subscription.reload.inactive?
    @subscription.billing_active!
    assert @subscription.reload.active?

    @first.update!(enabled: true)
    @first.delivery_channel.update!(enabled: false)
    @subscription.reload.billing_inactive!
    @subscription.update!(stripe_status: "canceled", cancel_at_period_end: true)
    assert @subscription.reload.inactive?
    assert_equal "canceled", @subscription.stripe_status

    assert_raises(StripeBilling::PricingError) do
      SubscriptionDeliveryBilling.select!(@subscription, [@first.id])
    end
    @subscription.delivery_destinations.to_a.first.recipient = "changed"
    assert_not @subscription.valid?
  end

  test "billing deactivation survives an unavailable personal connection" do
    connection =
      DeliveryConnection.create!(
        user: @subscription.user,
        provider: "slack",
        name: "Slack",
        access_token: "test-secret",
        enabled: true
      )
    channel =
      DeliveryChannel.create!(key: "slack", enabled: true, amount_cents: 0)
    destination =
      DeliveryDestination.create!(
        user: @subscription.user,
        delivery_channel: channel,
        delivery_connection: connection,
        recipient: "#general"
      )
    @subscription.update!(stripe_subscription_id: nil)
    SubscriptionDeliveryBilling.select!(@subscription, [destination.id])
    connection.update!(enabled: false)
    @subscription.reload.billing_inactive!
    assert @subscription.reload.inactive?
  end

  private

  def remote(amount:, pending: nil)
    Stripe::Subscription.construct_from(
      id: "sub_delivery",
      object: "subscription",
      status: "active",
      pending_update: pending,
      items: {
        object: "list",
        data: [
          {
            id: "si_delivery",
            object: "subscription_item",
            price: {
              id: "price_old",
              object: "price",
              product: "prod_delivery",
              currency: "eur",
              unit_amount: amount
            }
          }
        ]
      }
    )
  end

  def stub_remote(amount:)
    stub_request(
      :get,
      "https://api.stripe.com/v1/subscriptions/sub_delivery"
    ).to_return(
      status: 200,
      body: remote(amount: amount).to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )
  end

  def stub_update(amount:, pending: nil)
    stub_request(
      :post,
      "https://api.stripe.com/v1/subscriptions/sub_delivery"
    ).to_return(
      status: 200,
      body: remote(amount: amount, pending: pending).to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )
  end
end
