# frozen_string_literal: true

require "test_helper"

class StripeWebhooksControllerTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper

  setup { clear_enqueued_jobs }

  test "archives and enqueues a verified event once" do
    payload = event_payload
    signature = signature_for(payload)

    assert_difference("StripeEvent.count", 1) do
      assert_enqueued_with(job: StripeEventProcessJob) do
        post(
          stripe_webhooks_path,
          params: payload,
          headers: {
            "Content-Type" => "application/json",
            "Stripe-Signature" => signature
          }
        )
      end
    end
    assert_response(:success)

    assert_no_difference("StripeEvent.count") do
      post(
        stripe_webhooks_path,
        params: payload,
        headers: {
          "Content-Type" => "application/json",
          "Stripe-Signature" => signature
        }
      )
    end
    assert_response(:success)
  end

  test "rejects an invalid signature" do
    assert_no_difference("StripeEvent.count") do
      post(
        stripe_webhooks_path,
        params: event_payload,
        headers: {
          "Content-Type" => "application/json",
          "Stripe-Signature" => "invalid"
        }
      )
    end
    assert_response(:bad_request)
  end

  test "accepts a signature from another configured webhook secret" do
    payload = event_payload

    assert_difference("StripeEvent.count", 1) do
      assert_enqueued_with(job: StripeEventProcessJob) do
        post(
          stripe_webhooks_path,
          params: payload,
          headers: {
            "Content-Type" => "application/json",
            "Stripe-Signature" =>
              signature_for(
                payload,
                webhook_secret: Config.stripe.webhook_secrets.second
              )
          }
        )
      end
    end
    assert_response(:success)
  end

  test "re-enqueues a previously failed event" do
    payload = event_payload
    event =
      StripeEvent.create!(
        stripe_event_id: "evt_test_billing",
        event_type: "test_helpers.test_clock.created",
        stripe_created_at: Time.current,
        payload: JSON.parse(payload),
        status: "failed",
        processing_error: "Stripe::APIConnectionError: unavailable"
      )

    assert_no_difference("StripeEvent.count") do
      assert_enqueued_with(job: StripeEventProcessJob, args: [event]) do
        post(
          stripe_webhooks_path,
          params: payload,
          headers: {
            "Content-Type" => "application/json",
            "Stripe-Signature" => signature_for(payload)
          }
        )
      end
    end

    assert_response(:success)
    assert_equal("enqueued", event.reload.status)
    assert_nil(event.processing_error)
  end

  private

  def event_payload
    {
      id: "evt_test_billing",
      object: "event",
      api_version: Stripe.api_version,
      created: Time.current.to_i,
      data: {
        object: {
          id: "obj_test",
          object: "test_helpers.test_clock"
        }
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: nil,
        idempotency_key: nil
      },
      type: "test_helpers.test_clock.created"
    }.to_json
  end

  def signature_for(payload, webhook_secret: Config.stripe.webhook_secrets.first)
    timestamp = Time.current
    signature =
      Stripe::Webhook::Signature.compute_signature(
        timestamp,
        payload,
        webhook_secret
      )
    Stripe::Webhook::Signature.generate_header(timestamp, signature)
  end
end
