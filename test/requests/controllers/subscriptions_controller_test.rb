# frozen_string_literal: true

require "test_helper"

class SubscriptionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin = users(:admin)
    Current.with(user: @admin) do
      @plan = Plan.create!(service: services(:service), slug: "bulk-removal")
      @subscriptions =
        %w[sub_bulk_one sub_bulk_two].map do |stripe_id|
          Subscription.create!(
            plan: @plan,
            stripe_subscription_id: stripe_id,
            stripe_status: "active",
            status: "active"
          )
        end
      Subscription.create!(plan: @plan, status: "inactive")
      Subscription.create!(
        plan: @plan,
        stripe_subscription_id: "sub_already_canceled",
        stripe_status: "canceled",
        status: "inactive"
      )
      subscriptions(:subscription).update!(
        stripe_subscription_id: "sub_outside_scope",
        stripe_status: "active"
      )
    end
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  test "destroy all cancels billed subscriptions within the plan" do
    requests = stub_cancellations

    assert_difference("Subscription.count", -4) do
      delete(destroy_all_subscriptions_path(plan_id: @plan.id))
    end

    assert_redirected_to(subscriptions_path(plan_id: @plan.id))
    requests.each { |request| assert_requested(request, times: 1) }
    assert(Subscription.exists?(subscriptions(:subscription).id))
  end

  test "delete all cancels billed subscriptions within the plan" do
    requests = stub_cancellations

    assert_difference("Subscription.count", -4) do
      delete(delete_all_subscriptions_path(plan_id: @plan.id), as: :json)
    end

    assert_response(:success)
    requests.each { |request| assert_requested(request, times: 1) }
    assert(Subscription.exists?(subscriptions(:subscription).id))
  end

  test "destroy all keeps local subscriptions when cancellation fails" do
    stub_failed_cancellations

    assert_no_difference("Subscription.count") do
      assert_raises(Stripe::InvalidRequestError) do
        delete(destroy_all_subscriptions_path(plan_id: @plan.id))
      end
    end
  end

  test "delete all keeps local subscriptions when cancellation fails" do
    stub_failed_cancellations

    assert_no_difference("Subscription.count") do
      assert_raises(Stripe::InvalidRequestError) do
        delete(delete_all_subscriptions_path(plan_id: @plan.id), as: :json)
      end
    end
  end

  private

  def stub_cancellations
    @subscriptions.map do |subscription|
      stub_request(
        :delete,
        "https://api.stripe.com/v1/subscriptions/#{subscription.stripe_subscription_id}"
      ).to_return(
        status: 200,
        body: {
          id: subscription.stripe_subscription_id,
          object: "subscription",
          status: "canceled"
        }.to_json,
        headers: {
          "Content-Type" => "application/json"
        }
      )
    end
  end

  def stub_failed_cancellations
    @subscriptions.each do |subscription|
      stub_request(
        :delete,
        "https://api.stripe.com/v1/subscriptions/#{subscription.stripe_subscription_id}"
      ).to_return(
        status: 400,
        body: {
          error: {
            type: "invalid_request_error",
            message: "Cancellation failed"
          }
        }.to_json,
        headers: {
          "Content-Type" => "application/json"
        }
      )
    end
  end
end
