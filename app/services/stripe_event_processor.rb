# frozen_string_literal: true

class StripeEventProcessor
  ACCESS_INACTIVE_STATUSES = %w[
    canceled
    incomplete
    incomplete_expired
    paused
    unpaid
  ].freeze

  def initialize(stripe_event)
    @stripe_event = stripe_event
  end

  def call
    stripe_event.update!(status: "processing", processing_error: nil)
    event = Stripe::Event.construct_from(stripe_event.payload)

    case event.type
    when "checkout.session.completed",
         "checkout.session.async_payment_succeeded"
      sync_checkout(event.data.object)
    when "checkout.session.async_payment_failed"
      subscription = find_subscription(event.data.object)
      if subscription
        with_subscription_context(subscription) do
          subscription.billing_inactive!
        end
      end
    when "customer.subscription.created", "customer.subscription.updated",
         "customer.subscription.deleted"
      sync_subscription(event.data.object.id)
    when "invoice.created", "invoice.finalized", "invoice.updated",
         "invoice.paid", "invoice.payment_failed",
         "invoice.payment_action_required", "invoice.finalization_failed"
      sync_invoice(event.data.object.id, event.type)
    end

    stripe_event.processed!
  rescue StandardError => e
    stripe_event.failed!(e)
    raise
  end

  private

  attr_reader :stripe_event

  def sync_checkout(checkout)
    subscription = find_subscription(checkout)
    return unless subscription

    with_subscription_context(subscription) do
      subscription.update!(
        stripe_checkout_session_id: checkout.id,
        stripe_subscription_id: checkout.subscription.presence
      )
    end
    sync_subscription(checkout.subscription) if checkout.subscription.present?
  end

  def sync_subscription(stripe_subscription_id)
    stripe_subscription = Stripe::Subscription.retrieve(stripe_subscription_id)
    subscription =
      Subscription.find_by(stripe_subscription_id: stripe_subscription.id) ||
        Subscription.find_by(id: stripe_subscription.metadata&.subscription_id)
    return unless subscription

    period_start, period_end = subscription_period(stripe_subscription)
    with_subscription_context(subscription) do
      subscription.with_lock do
        subscription.update!(
          stripe_subscription_id: stripe_subscription.id,
          stripe_status: stripe_subscription.status,
          cancel_at_period_end:
            stripe_subscription.cancel_at_period_end || false,
          current_period_start: timestamp(period_start),
          current_period_end: timestamp(period_end)
        )
        if stripe_subscription.status == "active"
          subscription.billing_active!
        elsif ACCESS_INACTIVE_STATUSES.include?(stripe_subscription.status)
          subscription.billing_inactive!
        end
      end
    end
  end

  def sync_invoice(stripe_invoice_id, event_type)
    invoice = Stripe::Invoice.retrieve(stripe_invoice_id)
    subscription = find_invoice_subscription(invoice)
    return unless subscription

    StripeInvoice.upsert(
      {
        subscription_id: subscription.id,
        stripe_invoice_id: invoice.id,
        stripe_payment_intent_id: invoice.payment_intent,
        number: invoice.number,
        status: invoice.status,
        amount_due: invoice.amount_due || 0,
        amount_paid: invoice.amount_paid || 0,
        currency: invoice.currency,
        period_start: timestamp(invoice.period_start),
        period_end: timestamp(invoice.period_end),
        paid_at: timestamp(invoice.status_transitions&.paid_at),
        hosted_invoice_url: invoice.hosted_invoice_url,
        invoice_pdf: invoice.invoice_pdf,
        created_at: Time.current,
        updated_at: Time.current
      },
      unique_by: :stripe_invoice_id,
      update_only: %i[
        subscription_id
        stripe_payment_intent_id
        number
        status
        amount_due
        amount_paid
        currency
        period_start
        period_end
        paid_at
        hosted_invoice_url
        invoice_pdf
      ]
    )

    with_subscription_context(subscription) do
      subscription.with_lock do
        if invoice.status == "paid" && stripe_subscription_active?(invoice)
          subscription.billing_active!
        elsif event_type.in?(
              %w[invoice.payment_failed invoice.finalization_failed]
            )
          subscription.billing_inactive!
        end
      end
    end
    stripe_subscription_id = invoice_subscription_id(invoice)
    return if stripe_subscription_id.blank?

    sync_subscription(stripe_subscription_id)
  end

  def stripe_subscription_active?(invoice)
    stripe_subscription =
      Stripe::Subscription.retrieve(invoice_subscription_id(invoice))
    stripe_subscription.status == "active"
  end

  def find_invoice_subscription(invoice)
    subscription_details = invoice.parent&.subscription_details
    Subscription.find_by(
      stripe_subscription_id: invoice_subscription_id(invoice)
    ) ||
      Subscription.find_by(id: subscription_details&.metadata&.subscription_id)
  end

  def invoice_subscription_id(invoice)
    invoice[:subscription] ||
      invoice.parent&.subscription_details&.subscription
  end

  def find_subscription(object)
    Subscription.find_by(id: object.metadata&.subscription_id) ||
      Subscription.find_by(stripe_checkout_session_id: object.id)
  end

  def subscription_period(stripe_subscription)
    item = stripe_subscription.items&.data&.first
    [
      stripe_subscription[:current_period_start] || item&.current_period_start,
      stripe_subscription[:current_period_end] || item&.current_period_end
    ]
  end

  def timestamp(value)
    Time.at(value).utc if value.present?
  end

  def with_subscription_context(subscription, &)
    Current.with(user: subscription.user, subscription: subscription, &)
  end
end
