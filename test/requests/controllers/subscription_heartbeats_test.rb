# frozen_string_literal: true

require "test_helper"

class SubscriptionHeartbeatsTest < ActionDispatch::IntegrationTest
  setup do
    @subscription = subscriptions(:subscription)
    @url = "https://heartbeats.dorianmarie.com/checks/example"
  end

  test "admin can create update and clear a heartbeats url" do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    plan =
      Current.with(user: users(:admin)) do
        Plan.create!(
          service: services(:service),
          slug: "heartbeats",
          pricing_input: plans(:plan).pricing_input
        )
      end

    post(
      subscriptions_path,
      params: {
        subscription: {
          plan_id: plan.id,
          heartbeats_url: @url,
          delivery_destinations_attributes: [
            { delivery_channel_id: messages_channel.id }
          ]
        }
      },
      as: :json
    )
    assert_response(:success, response.body)
    subscription =
      Subscription.find(response.parsed_body.fetch("data").fetch("id"))
    assert_equal(@url, subscription.heartbeats_url)

    get(edit_subscription_path(subscription))
    assert_response(:success)
    assert_select("input[name='subscription[heartbeats_url]'][type='url']")
    get(subscription_path(subscription))
    assert_select("a[href=?]", @url, count: 1)

    patch(
      subscription_path(subscription),
      params: {
        subscription: {
          heartbeats_url: " https://example.com/status?check=1 "
        }
      },
      as: :json
    )
    assert_response(:success)
    assert_equal(
      "https://example.com/status?check=1",
      subscription.reload.heartbeats_url
    )

    patch(
      subscription_path(subscription),
      params: {
        subscription: {
          heartbeats_url: " "
        }
      },
      as: :json
    )
    assert_response(:success)
    assert_nil(subscription.reload.heartbeats_url)
    get(subscription_path(subscription))
    assert_select("a[href=?]", @url, count: 0)
  end

  %w[simple advanced].each do |interface|
    test "#{interface} owner has the expected visibility and cannot write heartbeats url" do
      user = users(:other_user)
      Current.with(user: users(:admin)) do
        user.update!(interface: interface)
        @subscription.update!(user: user, heartbeats_url: @url)
      end
      sign_in(
        email_addresses(:other_email).email_address,
        passwords(:other_password).hint
      )

      get(subscription_path(@subscription))
      assert_response(:success)
      assert_select("a[href=?]", @url, count: interface == "advanced" ? 1 : 0)
      get(subscription_path(@subscription), as: :json)
      assert_response(:success)
      assert_equal(
        @url,
        response.parsed_body.fetch("data").fetch("heartbeats_url")
      )

      patch(
        subscription_path(@subscription),
        params: {
          subscription: {
            heartbeats_url: "https://example.com"
          }
        }
      )
      assert_redirected_to(root_path)
      assert_equal(@url, @subscription.reload.heartbeats_url)

      plan =
        Current.with(user: users(:admin)) do
          service = Service.create!
          Plan.create!(
            service: service,
            slug: "owner-heartbeats",
            pricing_input: plans(:plan).pricing_input
          )
        end
      post(
        subscriptions_path,
        params: {
          subscription: {
            plan_id: plan.id,
            heartbeats_url: @url,
            delivery_destinations_attributes: [
              { delivery_channel_id: messages_channel.id }
            ]
          }
        },
        as: :json
      )
      assert_response(:success)
      created =
        Subscription.find(response.parsed_body.fetch("data").fetch("id"))
      assert_nil(created.heartbeats_url)
    end
  end

  private

  def messages_channel
    Current.with(user: users(:admin)) do
      DeliveryChannel.find_or_create_by!(key: "messages") do |channel|
        channel.enabled = true
        channel.amount_cents = 0
      end
    end
  end
end
