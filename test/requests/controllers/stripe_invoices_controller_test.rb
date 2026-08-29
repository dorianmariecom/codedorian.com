# frozen_string_literal: true

require "test_helper"

class StripeInvoicesControllerTest < ActionDispatch::IntegrationTest
  include ControllerSmokeHelper

  setup do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  smoke_actions_for "stripe_invoices"

  test "admin creates, updates, and destroys a Stripe invoice" do
    assert_difference("StripeInvoice.count", 1) do
      post(
        stripe_invoices_path,
        params: {
          stripe_invoice: {
            subscription_id: subscriptions(:subscription).id,
            stripe_invoice_id: "in_controller_create",
            stripe_payment_intent_id: "pi_controller_create",
            number: "CONTROLLER-1",
            status: "open",
            currency: "eur",
            amount_due: 2500,
            amount_paid: 0,
            period_start: Time.current,
            period_end: 1.month.from_now,
            hosted_invoice_url: "https://invoice.example.test/controller",
            invoice_pdf: "https://invoice.example.test/controller.pdf"
          }
        }
      )
    end

    stripe_invoice =
      StripeInvoice.find_by!(stripe_invoice_id: "in_controller_create")
    assert_redirected_to(stripe_invoice_path(stripe_invoice))

    patch(
      stripe_invoice_path(stripe_invoice),
      params: {
        stripe_invoice: {
          subscription_id: stripe_invoice.subscription_id,
          stripe_invoice_id: stripe_invoice.stripe_invoice_id,
          stripe_payment_intent_id: stripe_invoice.stripe_payment_intent_id,
          number: stripe_invoice.number,
          status: "paid",
          currency: stripe_invoice.currency,
          amount_due: stripe_invoice.amount_due,
          amount_paid: stripe_invoice.amount_due,
          period_start: stripe_invoice.period_start,
          period_end: stripe_invoice.period_end,
          paid_at: Time.current,
          hosted_invoice_url: stripe_invoice.hosted_invoice_url,
          invoice_pdf: stripe_invoice.invoice_pdf
        }
      }
    )

    assert_redirected_to(stripe_invoice_path(stripe_invoice))
    assert_predicate(stripe_invoice.reload, :paid?)

    assert_difference("StripeInvoice.count", -1) do
      delete(stripe_invoice_path(stripe_invoice))
    end
    assert_redirected_to(stripe_invoices_path)
  end
end
