# frozen_string_literal: true

require "test_helper"

class StripeEventProcessorTest < ActiveSupport::TestCase
  setup do
    @subscription = subscriptions(:subscription)
    Current.with(user: @subscription.user) do
      @subscription.update!(
        status: "inactive",
        stripe_subscription_id: "sub_test"
      )
    end
  end

  test "paid invoice activates access and records the invoice" do
    event = stripe_event("invoice.paid", "in_paid")
    invoice = stripe_invoice("in_paid", status: "paid", amount_paid: 1_000)

    stub_stripe(invoice, stripe_subscription("active"))
    StripeEventProcessor.new(event).call

    assert_predicate(@subscription.reload, :active?)
    assert_equal("processed", event.reload.status)
    assert_equal(
      1_000,
      @subscription
        .stripe_invoices
        .find_by!(stripe_invoice_id: "in_paid")
        .amount_paid
    )
  end

  test "later invoice events preserve the local invoice creation time" do
    event = stripe_event("invoice.created", "in_created_at")
    invoice = stripe_invoice("in_created_at", status: "open", amount_paid: 0)
    stub_stripe(invoice, stripe_subscription("active"))

    StripeEventProcessor.new(event).call
    stripe_invoice_record =
      @subscription.stripe_invoices.find_by!(
        stripe_invoice_id: "in_created_at"
      )
    created_at = stripe_invoice_record.created_at

    travel(1.hour) do
      update_event = stripe_event("invoice.updated", "in_created_at_update")
      update_event.update!(
        payload: update_event.payload.deep_merge(
          "data" => { "object" => { "id" => "in_created_at" } }
        )
      )
      StripeEventProcessor.new(update_event).call
    end

    assert_equal(created_at, stripe_invoice_record.reload.created_at)
  end

  test "failed invoice immediately deactivates access" do
    Current.with(user: @subscription.user) { @subscription.activate! }
    event = stripe_event("invoice.payment_failed", "in_failed")
    invoice = stripe_invoice("in_failed", status: "open", amount_paid: 0)

    stub_stripe(invoice, stripe_subscription("past_due"))
    StripeEventProcessor.new(event).call

    assert_predicate(@subscription.reload, :inactive?)
    assert_equal("processed", event.reload.status)
  end

  test "paid invoice supports subscription details in the invoice parent" do
    event = stripe_event("invoice.paid", "in_parent_paid")
    invoice =
      stripe_invoice("in_parent_paid", status: "paid", amount_paid: 1_000)
    invoice[:subscription] = nil
    invoice.parent = {
      type: "subscription_details",
      subscription_details: {
        subscription: "sub_test",
        metadata: {
          subscription_id: @subscription.id
        }
      }
    }

    stub_stripe(invoice, stripe_subscription("active"))
    StripeEventProcessor.new(event).call

    assert_predicate(@subscription.reload, :active?)
    assert_equal("processed", event.reload.status)
  end

  test "active Stripe subscription activates access" do
    event = stripe_event("customer.subscription.updated", "sub_test")
    subscription = stripe_subscription("active")
    stub_request(
      :get,
      "https://api.stripe.com/v1/subscriptions/#{subscription.id}"
    ).to_return(
      status: 200,
      body: subscription.to_hash.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )

    StripeEventProcessor.new(event).call

    assert_predicate(@subscription.reload, :active?)
    assert_equal("active", @subscription.stripe_status)
    assert_equal("processed", event.reload.status)
  end

  private

  def stripe_event(type, invoice_id)
    StripeEvent.create!(
      stripe_event_id: "evt_#{invoice_id}",
      event_type: type,
      stripe_created_at: Time.current,
      payload: {
        id: "evt_#{invoice_id}",
        object: "event",
        type: type,
        data: {
          object: {
            id: invoice_id,
            object: "invoice"
          }
        }
      }
    )
  end

  def stripe_invoice(id, status:, amount_paid:)
    Stripe::StripeObject.construct_from(
      id: id,
      object: "invoice",
      subscription: "sub_test",
      payment_intent: "pi_test",
      number: "TEST-1",
      status: status,
      amount_due: 1_000,
      amount_paid: amount_paid,
      currency: "eur",
      period_start: 1.day.ago.to_i,
      period_end: 1.month.from_now.to_i,
      status_transitions: {
        paid_at: status == "paid" ? Time.current.to_i : nil
      },
      hosted_invoice_url: "https://invoice.test",
      invoice_pdf: "https://invoice.test/pdf"
    )
  end

  def stripe_subscription(status)
    Stripe::StripeObject.construct_from(
      id: "sub_test",
      object: "subscription",
      status: status,
      cancel_at_period_end: false,
      metadata: {
        subscription_id: @subscription.id
      },
      items: {
        data: [
          {
            current_period_start: Time.current.to_i,
            current_period_end: 1.month.from_now.to_i
          }
        ]
      }
    )
  end

  def stub_stripe(invoice, subscription)
    headers = { "Content-Type" => "application/json" }
    stub_request(
      :get,
      "https://api.stripe.com/v1/invoices/#{invoice.id}"
    ).to_return(status: 200, body: invoice.to_hash.to_json, headers: headers)
    stub_request(
      :get,
      "https://api.stripe.com/v1/subscriptions/#{subscription.id}"
    ).to_return(
      status: 200,
      body: subscription.to_hash.to_json,
      headers: headers
    )
  end
end
