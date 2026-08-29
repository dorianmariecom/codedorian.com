# frozen_string_literal: true

require "digest"

class StripeBilling
  CUSTOMER_IDEMPOTENCY_VERSION = 2
  CHECKOUT_IDEMPOTENCY_VERSION = 3

  class PricingError < StandardError
  end

  class << self
    def publishable_key
      Config.stripe.publishable_key
    end

    def webhook_secrets
      Config.stripe.webhook_secrets
    end

    def ensure_customer!(user)
      return user.stripe_customer_id if user.stripe_customer_id.present?

      customer_params = {
        metadata: {
          env: Current.env,
          user_id: user.id
        }
      }
      request_digest = Digest::SHA256.hexdigest(customer_params.to_json)
      idempotency_key =
        "user-#{user.id}-stripe-customer-" \
          "v#{CUSTOMER_IDEMPOTENCY_VERSION}-#{request_digest}"
      customer =
        Stripe::Customer.create(
          customer_params,
          { idempotency_key: idempotency_key }
        )
      if user.email_address.present?
        Stripe::Customer.update(customer.id, { email: user.email_address })
      end
      user.update!(stripe_customer_id: customer.id)
      customer.id
    rescue ActiveRecord::RecordNotUnique
      user.reload.stripe_customer_id
    end

    def create_checkout_session!(subscription, return_url:)
      checkout_snapshot = subscription.ensure_checkout_snapshot!
      customer_id = ensure_customer!(subscription.user)
      idempotency_key =
        "checkout-v#{CHECKOUT_IDEMPOTENCY_VERSION}-#{checkout_snapshot}"
      metadata = {
        env: Current.env,
        user_id: subscription.user_id,
        plan_id: subscription.plan_id,
        subscription_id: subscription.id
      }
      session =
        Stripe::Checkout::Session.create(
          {
            automatic_tax: {
              enabled: true
            },
            billing_address_collection: "required",
            client_reference_id: subscription.id.to_s,
            customer: customer_id,
            customer_update: {
              address: "auto",
              name: "auto"
            },
            line_items: [
              {
                price_data: {
                  currency: subscription.amount_currency,
                  product_data: {
                    name: subscription.plan.to_s,
                    metadata: {
                      plan_id: subscription.plan_id
                    }
                  },
                  recurring: {
                    interval: "month"
                  },
                  tax_behavior: "inclusive",
                  unit_amount: subscription.amount_cents
                },
                quantity: 1
              }
            ],
            metadata: metadata,
            managed_payments: {
              enabled: false
            },
            mode: "subscription",
            return_url: return_url,
            subscription_data: {
              metadata: metadata
            },
            ui_mode: "elements"
          },
          { idempotency_key: idempotency_key }
        )
      subscription.update!(stripe_checkout_session_id: session.id)
      session
    end

    def cancel!(subscription)
      stripe_subscription =
        Stripe::Subscription.update(
          subscription.stripe_subscription_id,
          { cancel_at_period_end: true }
        )
      subscription.update!(
        cancel_at_period_end: stripe_subscription.cancel_at_period_end
      )
    end

    def resume!(subscription)
      stripe_subscription =
        Stripe::Subscription.update(
          subscription.stripe_subscription_id,
          { cancel_at_period_end: false }
        )
      subscription.update!(
        cancel_at_period_end: stripe_subscription.cancel_at_period_end
      )
    end

    def destroy!(subscription)
      if subscription.stripe_subscription_id.blank? ||
           subscription.stripe_status == "canceled"
        return
      end

      Stripe::Subscription.cancel(subscription.stripe_subscription_id)
    end

    def create_setup_intent!(subscription)
      Stripe::SetupIntent.create(
        {
          customer: ensure_customer!(subscription.user),
          metadata: {
            subscription_id: subscription.id
          },
          usage: "off_session"
        }
      )
    end

    def apply_setup_intent!(subscription, setup_intent_id)
      setup_intent = Stripe::SetupIntent.retrieve(setup_intent_id)
      unless setup_intent.customer == subscription.user.stripe_customer_id &&
               setup_intent.status == "succeeded" &&
               setup_intent.metadata&.subscription_id.to_s ==
                 subscription.id.to_s
        raise Stripe::InvalidRequestError.new(
                "Invalid SetupIntent",
                "setup_intent"
              )
      end

      payment_method = setup_intent.payment_method
      Stripe::Customer.update(
        subscription.user.stripe_customer_id,
        { invoice_settings: { default_payment_method: payment_method } }
      )
      Stripe::Subscription.update(
        subscription.stripe_subscription_id,
        { default_payment_method: payment_method }
      )
      retry_latest_invoice!(subscription)
    end

    def retry_latest_invoice!(subscription)
      invoice =
        subscription
          .stripe_invoices
          .where.not(status: "paid")
          .order(period_end: :desc)
          .first
      Stripe::Invoice.pay(invoice.stripe_invoice_id) if invoice
    end
  end
end
