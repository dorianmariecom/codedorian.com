# frozen_string_literal: true

require "test_helper"

class StripeEventsControllerTest < ActionDispatch::IntegrationTest
  include ControllerSmokeHelper

  setup do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  smoke_actions_for "stripe_events"

  test "admin creates, updates, and destroys a Stripe event" do
    assert_difference("StripeEvent.count", 1) do
      post(
        stripe_events_path,
        params: {
          stripe_event: {
            stripe_event_id: "evt_controller_create",
            event_type: "invoice.updated",
            status: "pending",
            livemode: "0",
            stripe_created_at: Time.current,
            payload: {
              id: "evt_controller_create",
              object: "event"
            }.to_json
          }
        }
      )
    end

    stripe_event = StripeEvent.find_by!(stripe_event_id: "evt_controller_create")
    assert_redirected_to(stripe_event_path(stripe_event))
    assert_equal("event", stripe_event.payload.fetch("object"))

    patch(
      stripe_event_path(stripe_event),
      params: {
        stripe_event: {
          stripe_event_id: stripe_event.stripe_event_id,
          event_type: stripe_event.event_type,
          status: "processed",
          livemode: "0",
          stripe_created_at: stripe_event.stripe_created_at,
          processed_at: Time.current,
          payload: stripe_event.payload.to_json
        }
      }
    )

    assert_redirected_to(stripe_event_path(stripe_event))
    assert_equal("processed", stripe_event.reload.status)

    assert_difference("StripeEvent.count", -1) do
      delete(stripe_event_path(stripe_event))
    end
    assert_redirected_to(stripe_events_path)
  end

  test "controller rejects invalid payload JSON" do
    assert_no_difference("StripeEvent.count") do
      post(
        stripe_events_path,
        params: {
          stripe_event: {
            stripe_event_id: "evt_invalid_json",
            event_type: "invoice.updated",
            status: "pending",
            stripe_created_at: Time.current,
            payload: "not JSON"
          }
        }
      )
    end

    assert_response(:unprocessable_content)
  end
end
