# frozen_string_literal: true

class StripeWebhooksController < ActionController::API
  def create
    event =
      Stripe::Webhook.construct_event(
        request.raw_post,
        request.headers.fetch("Stripe-Signature"),
        StripeBilling.webhook_secret
      )
    stripe_event = StripeEvent.find_by(stripe_event_id: event.id)
    if stripe_event
      stripe_event.with_lock do
        if stripe_event.status.in?(%w[pending failed])
          stripe_event.update!(status: "enqueued", processing_error: nil)
          StripeEventProcessJob.perform_later(stripe_event)
        end
      end
    else
      stripe_event =
        StripeEvent.create!(
          stripe_event_id: event.id,
          event_type: event.type,
          livemode: event.livemode,
          stripe_created_at: Time.at(event.created).utc,
          payload: event.to_hash,
          status: "enqueued"
        )
      StripeEventProcessJob.perform_later(stripe_event)
    end
    render(json: { status: :ok, messages: [], data: nil })
  rescue ActiveRecord::RecordNotUnique
    render(json: { status: :ok, messages: [], data: nil })
  rescue KeyError, JSON::ParserError, Stripe::SignatureVerificationError
    render(
      json: { status: :bad_request, messages: ["Invalid webhook"], data: nil },
      status: :bad_request
    )
  end
end
