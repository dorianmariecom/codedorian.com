# frozen_string_literal: true

class SubscriptionBillingsController < ApplicationController
  before_action :load_subscription

  def show
    authorize(@subscription, :show?)
    if params[:setup_intent].present?
      StripeBilling.apply_setup_intent!(@subscription, params[:setup_intent])
      return(
        redirect_to(
          subscription_billing_path(@subscription),
          notice: t("subscription_billings.setup_payment_method.notice")
        )
      )
    end
    load_billing
  rescue Stripe::StripeError => e
    @billing_error = e.message
    load_billing
  end

  def checkout
    authorize(@subscription, :update?)
    session =
      StripeBilling.create_checkout_session!(
        @subscription,
        return_url: subscription_billing_url(@subscription)
      )
    redirect_to subscription_billing_path(@subscription), notice: t(".notice")
  rescue Stripe::StripeError, StripeBilling::PricingError => e
    redirect_to subscription_billing_path(@subscription), alert: e.message
  end

  def cancel
    authorize(@subscription, :update?)
    StripeBilling.cancel!(@subscription)
    redirect_to subscription_billing_path(@subscription), notice: t(".notice")
  end

  def resume
    authorize(@subscription, :update?)
    StripeBilling.resume!(@subscription)
    redirect_to subscription_billing_path(@subscription), notice: t(".notice")
  end

  def retry_payment
    authorize(@subscription, :update?)
    StripeBilling.retry_latest_invoice!(@subscription)
    redirect_to subscription_billing_path(@subscription), notice: t(".notice")
  end

  def setup_payment_method
    authorize(@subscription, :update?)
    setup_intent = StripeBilling.create_setup_intent!(@subscription)
    @setup_client_secret = setup_intent.client_secret
    @setup_return_url = subscription_billing_url(@subscription)
    load_billing
    render :show, status: :unprocessable_content
  rescue Stripe::StripeError => e
    redirect_to subscription_billing_path(@subscription), alert: e.message
  end

  private

  def load_subscription
    @subscription =
      authorize(
        policy_scope(Subscription).find(params.expect(:subscription_id)),
        :show?
      )
    set_context(subscription: @subscription)
  end

  def load_billing
    @stripe_invoices = @subscription.stripe_invoices.order(period_end: :desc)
    return if @subscription.stripe_checkout_session_id.blank?

    session =
      Stripe::Checkout::Session.retrieve(
        @subscription.stripe_checkout_session_id
      )
    if session.status == "open"
      @checkout_client_secret = session.client_secret
    elsif session.status == "complete" && session.subscription.present?
      @subscription.update!(stripe_subscription_id: session.subscription)
    elsif session.status == "complete"
      @checkout_pending = true
    elsif session.status == "expired" && !@subscription.billed?
      @subscription.reset_checkout!
    end
  rescue Stripe::StripeError => e
    @billing_error = e.message
  end

  def model_class = Subscription
  def model_instance = @subscription
  def nested = []
  def filters = []
end
