# frozen_string_literal: true

require "test_helper"

class SubscriptionBillingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin = users(:admin)
    @subscription = subscriptions(:subscription)
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  test "subscriber can view billing" do
    Current.with(user: @admin) do
      @subscription.update!(amount_cents: 1_000, amount_currency: "eur")
    end

    get(subscription_billing_path(@subscription))

    assert_response(:success)
    assert_select("turbo-cable-stream-source[channel='Turbo::StreamsChannel']")
    assert_select(
      "form[action=?]",
      checkout_subscription_billing_path(@subscription)
    )
    assert_includes(
      response.body,
      Money.new(1_000, "eur").format(locale: I18n.locale)
    )
  end

  test "another user cannot view billing" do
    delete(login_path)
    user = users(:other_user)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    get(subscription_billing_path(@subscription))

    assert_redirected_to(root_path)
  end

  test "advanced subscriber sees detailed billing attributes" do
    user = users(:other_user)
    subscription = nil
    period_start = Time.zone.parse("2026-08-01 10:00:00")
    Current.with(user: @admin) do
      user.update!(interface: :advanced, stripe_customer_id: "cus_other")
      subscription =
        Subscription.create!(
          user: user,
          plan: plans(:plan),
          status: :active,
          amount_cents: 1_000,
          amount_currency: "eur",
          stripe_subscription_id: "sub_other",
          stripe_status: "active",
          current_period_start: period_start,
          current_period_end: period_start + 1.month,
          cancel_at_period_end: true
        )
    end
    delete(login_path)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    get(subscription_billing_path(subscription))

    assert_response(:success)
    {
      stripe_customer_id: "cus_other",
      stripe_subscription_id: "sub_other",
      current_period_start: nil,
      cancel_at_period_end: "true"
    }.each do |attribute, value|
      assert_select(
        ".text-gray-600",
        text: I18n.t("subscription_billings.show.#{attribute}")
      )
      assert_select(".font-bold", text: value) if value
    end
  end

  test "subscriber can start elements checkout with managed payments disabled" do
    Current.with(user: @admin) do
      @admin.update!(stripe_customer_id: "cus_test")
    end
    checkout_request =
      stub_request(:post, "https://api.stripe.com/v1/checkout/sessions")
        .with do |request|
          form_data = URI.decode_www_form(request.body).to_h
          form_data["ui_mode"] == "elements" &&
            form_data["managed_payments[enabled]"] == "false" &&
            request.headers["Idempotency-Key"].start_with?("checkout-v3-")
        end
        .to_return(
          status: 200,
          body: {
            id: "cs_test",
            object: "checkout.session",
            client_secret: "cs_test_secret_test",
            status: "open"
          }.to_json,
          headers: {
            "Content-Type" => "application/json"
          }
        )

    post(checkout_subscription_billing_path(@subscription))

    assert_redirected_to(subscription_billing_path(@subscription))
    assert_requested(checkout_request)

    stub_request(
      :get,
      "https://api.stripe.com/v1/checkout/sessions/cs_test"
    ).to_return(
      status: 200,
      body: {
        id: "cs_test",
        object: "checkout.session",
        client_secret: "cs_test_secret_test",
        status: "open"
      }.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )
    get(subscription_billing_path(@subscription))

    assert_select("[data-stripe-checkout-target='billingAddress']")
  end

  test "completed checkout is kept while subscription reconciliation is pending" do
    Current.with(user: @admin) do
      @subscription.update!(
        stripe_checkout_session_id: "cs_complete",
        stripe_checkout_idempotency_key: "checkout-key"
      )
    end
    stub_request(
      :get,
      "https://api.stripe.com/v1/checkout/sessions/cs_complete"
    ).to_return(
      status: 200,
      body: {
        id: "cs_complete",
        object: "checkout.session",
        status: "complete",
        subscription: nil
      }.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )

    get(subscription_billing_path(@subscription))

    assert_response(:success)
    assert_equal("cs_complete", @subscription.reload.stripe_checkout_session_id)
    assert_equal("checkout-key", @subscription.stripe_checkout_idempotency_key)
    assert_select(
      "form[action=?]",
      checkout_subscription_billing_path(@subscription),
      count: 0
    )
  end

  test "completed checkout records the Stripe subscription before its webhook" do
    Current.with(user: @admin) do
      @subscription.update!(stripe_checkout_session_id: "cs_complete")
    end
    stub_request(
      :get,
      "https://api.stripe.com/v1/checkout/sessions/cs_complete"
    ).to_return(
      status: 200,
      body: {
        id: "cs_complete",
        object: "checkout.session",
        status: "complete",
        subscription: "sub_complete"
      }.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )

    get(subscription_billing_path(@subscription))

    assert_response(:success)
    assert_equal("sub_complete", @subscription.reload.stripe_subscription_id)
  end

  test "subscriber can open the payment method form" do
    Current.with(user: @admin) do
      @admin.update!(stripe_customer_id: "cus_test")
      @subscription.update!(stripe_subscription_id: "sub_test")
    end
    stub_request(:post, "https://api.stripe.com/v1/setup_intents").to_return(
      status: 200,
      body: {
        id: "seti_test",
        object: "setup_intent",
        client_secret: "seti_test_secret_test",
        customer: "cus_test",
        status: "requires_payment_method"
      }.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )

    post(setup_payment_method_subscription_billing_path(@subscription))

    assert_response(:unprocessable_content)
    assert_select("[data-controller='stripe-setup']")
  end

  test "setup intent cannot be applied to a different subscription" do
    Current.with(user: @admin) do
      @admin.update!(stripe_customer_id: "cus_test")
      @subscription.update!(stripe_subscription_id: "sub_test")
    end
    stub_request(
      :get,
      "https://api.stripe.com/v1/setup_intents/seti_other"
    ).to_return(
      status: 200,
      body: {
        id: "seti_other",
        object: "setup_intent",
        customer: "cus_test",
        metadata: {
          subscription_id: "different"
        },
        payment_method: "pm_test",
        status: "succeeded"
      }.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )

    get(subscription_billing_path(@subscription, setup_intent: "seti_other"))

    assert_response(:success)
    assert_includes(response.body, "Invalid SetupIntent")
    assert_not_requested(:post, %r{https://api\.stripe\.com/v1/customers/})
    assert_not_requested(:post, %r{https://api\.stripe\.com/v1/subscriptions/})
  end

  test "subscriber can cancel billing immediately" do
    Current.with(user: @admin) do
      @subscription.update!(stripe_subscription_id: "sub_test")
    end
    stub_request(
      :post,
      "https://api.stripe.com/v1/subscriptions/sub_test"
    ).to_return(
      status: 200,
      body: {
        id: "sub_test",
        object: "subscription",
        cancel_at_period_end: true
      }.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )

    post(cancel_subscription_billing_path(@subscription))

    assert_redirected_to(subscription_billing_path(@subscription))
    assert_predicate(@subscription.reload, :canceling?)
  end

  test "subscriber can resume billing immediately" do
    Current.with(user: @admin) do
      @subscription.update!(
        stripe_subscription_id: "sub_test",
        cancel_at_period_end: true
      )
    end
    stub_request(
      :post,
      "https://api.stripe.com/v1/subscriptions/sub_test"
    ).to_return(
      status: 200,
      body: {
        id: "sub_test",
        object: "subscription",
        cancel_at_period_end: false
      }.to_json,
      headers: {
        "Content-Type" => "application/json"
      }
    )

    post(resume_subscription_billing_path(@subscription))

    assert_redirected_to(subscription_billing_path(@subscription))
    assert_not_predicate(@subscription.reload, :canceling?)
  end
end
