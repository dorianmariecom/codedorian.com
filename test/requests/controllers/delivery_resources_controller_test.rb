# frozen_string_literal: true

require "test_helper"

class DeliveryResourcesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @channel =
      DeliveryChannel.create!(key: "messages", enabled: true, amount_cents: 0)
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
  end

  test "signup creates and selects a destination inside the subscription form" do
    sign_in_admin
    service = services(:service)
    Current.with(user: users(:admin)) do
      service.service_fields.create!(
        key: "x_username",
        kind: "text",
        required: true,
        position: 1,
        name_en: "X username",
        name_fr: "Nom sur X"
      )
    end
    get new_service_subscription_path(service),
        params: {
          plan_id: plans(:plan).id
        }
    assert_response :success
    assert_select "form template input[name*='[new_delivery_destinations_attributes]'][name$='[name]']",
                  false
    assert_select "a[href=?]", new_delivery_destination_path, count: 0
    assert_difference %w[
      Subscription.count
      DeliveryDestination.count
      SubscriptionDestination.count
    ],
                      1 do
      post service_subscriptions_path(service),
           params: {
             subscription: {
               plan_id: plans(:plan).id,
               subscription_values_attributes: {
                 "0" => {
                   key: "x_username",
                   value: "example"
                 }
               },
               new_delivery_destinations_attributes: {
                 "0" => {
                   delivery_channel_id: @channel.id
                 }
               }
             }
           },
           as: :json
    end
    assert_response :success
    subscription = Subscription.order(:id).last
    assert_equal users(:admin), subscription.delivery_destinations.sole.user
    assert_equal @channel.to_s, subscription.delivery_destinations.sole.name
    assert_equal 1000, subscription.amount_cents
  end

  test "invalid inline destinations preserve the form without saving records" do
    sign_in_admin
    service = services(:service)
    assert_no_difference %w[Subscription.count DeliveryDestination.count] do
      post service_subscriptions_path(service),
           params: {
             subscription: {
               plan_id: plans(:plan).id,
               new_delivery_destinations_attributes: {
                 "0" => {
                   delivery_channel_id: @channel.id,
                   visibility: "public"
                 }
               }
             }
           }
    end
    assert_response :unprocessable_content
    assert_select "input[name*='[new_delivery_destinations_attributes]'][name$='[name]']",
                  false
  end

  test "inline destinations are priced before an edited subscription is saved" do
    delete login_path
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    subscription =
      Current.with(user: users(:other_user)) do
        Subscription.create!(user: users(:other_user), plan: plans(:plan))
      end
    attributes = {
      subscription: {
        new_delivery_destinations_attributes: {
          "0" => {
            delivery_channel_id: @channel.id
          }
        }
      }
    }
    assert_no_difference "DeliveryDestination.count" do
      patch subscription_path(subscription), params: attributes, as: :json
    end
    assert_response :success
    assert_equal "confirmation_required", response.parsed_body["status"]
    confirmation = response.parsed_body.fetch("delivery_confirmation")
    assert_difference "DeliveryDestination.count", 1 do
      patch subscription_path(subscription),
            params: attributes.merge(delivery_confirmation: confirmation),
            as: :json
    end
    assert_response :success
    assert_equal @channel.to_s,
                 subscription.reload.delivery_destinations.sole.name
  end

  test "admin creates and edits reusable destination" do
    sign_in_admin
    get new_delivery_destination_path
    assert_response :success
    post delivery_destinations_path,
         params: {
           delivery_destination: {
             delivery_channel_id: @channel.id,
             visibility: "private"
           }
         }
    destination = DeliveryDestination.order(:id).last
    assert_equal users(:admin), destination.user
    assert_redirected_to destination
    get delivery_destination_path(destination)
    assert_response :success
    get edit_delivery_destination_path(destination)
    assert_response :success
    get delivery_destinations_path
    assert_response :success
  end

  test "owner cannot view another users destination" do
    destination =
      Current.with(user: users(:admin)) do
        DeliveryDestination.create!(
          user: users(:admin),
          delivery_channel: @channel,
          name: "Private inbox"
        )
      end
    get delivery_destination_path(destination), as: :json
    assert_response :bad_request
  end

  test "owners can read delivery content but cannot retry deliveries" do
    delivery = Current.with(user: users(:admin)) do
      subscription = Subscription.create!(user: users(:other_user), plan: plans(:plan))
      destination = DeliveryDestination.create!(user: subscription.user, delivery_channel: @channel)
      Delivery.create!(
        subscription: subscription,
        delivery_destination: destination,
        event_key: "private-content",
        status: "failed",
        payload: { subject: "Private update", body_text: "Full delivery content" }
      )
    end

    get delivery_path(delivery)
    assert_response :success
    assert_select "div", text: "Full delivery content"
    assert_select "form[action=?]", retry_delivery_path(delivery), count: 0
    get delivery_path(delivery), as: :json
    assert_response :success
    assert_equal "Full delivery content", response.parsed_body.dig("data", "payload", "body_text")
    post retry_delivery_path(delivery), as: :json
    assert_response :bad_request
    assert_equal "failed", delivery.reload.status

    other_delivery = Current.with(user: users(:admin)) do
      destination = DeliveryDestination.create!(user: users(:admin), delivery_channel: @channel)
      Delivery.create!(
        subscription: subscriptions(:subscription),
        delivery_destination: destination,
        event_key: "other-content"
      )
    end
    get delivery_path(other_delivery), as: :json
    assert_response :bad_request
  end

  test "editing preserves a destination whose channel is unavailable" do
    sign_in_admin
    destination = Current.with(user: users(:admin)) do
      DeliveryDestination.create!(user: users(:admin), delivery_channel: @channel)
    end
    @channel.update!(enabled: false)
    DeliveryChannel.create!(key: "push", enabled: true, amount_cents: 0)

    get edit_delivery_destination_path(destination)
    assert_response :success
    assert_select "select[name='delivery_destination[delivery_channel_id]'] option[selected][value=?]", @channel.id.to_s
    patch delivery_destination_path(destination), params: {
      delivery_destination: { delivery_channel_id: @channel.id, enabled: false }
    }
    assert_redirected_to destination
    assert_equal @channel, destination.reload.delivery_channel
    assert_not destination.enabled?
  end

  test "non admin cannot configure rates" do
    patch delivery_channel_path(@channel),
          params: {
            delivery_channel: {
              amount_cents: 1000
            }
          },
          as: :json
    assert_response :bad_request
    assert_equal 0, @channel.reload.amount_cents
  end

  test "owner cannot edit or reconcile delivery status" do
    delivery =
      Current.with(user: users(:other_user)) do
        subscription =
          Subscription.create!(user: users(:other_user), plan: plans(:plan))
        destination =
          DeliveryDestination.create!(
            user: users(:other_user),
            delivery_channel: @channel,
            name: "Inbox"
          )
        Delivery.create!(
          subscription: subscription,
          delivery_destination: destination,
          event_key: "protected",
          status: "uncertain"
        )
      end

    patch delivery_path(delivery),
          params: {
            delivery: {
              status: "delivered"
            }
          },
          as: :json
    assert_response :bad_request
    assert_equal "uncertain", delivery.reload.status
    post reconcile_delivery_path(delivery),
         params: {
           outcome: "delivered"
         },
         as: :json
    assert_response :bad_request
    assert_equal "uncertain", delivery.reload.status
  end

  test "credentials never appear in connection responses or forms" do
    sign_in_admin
    post delivery_connections_path,
         params: {
           delivery_connection: {
             name: "Slack",
             provider: "slack",
             credentials: {
               access_token: "private-test-token"
             }
           }
         },
         as: :json
    assert_response :success
    assert_not_includes response.body, "private-test-token"
    connection = DeliveryConnection.order(:id).last
    get edit_delivery_connection_path(connection)
    assert_response :success
    assert_not_includes response.body, "private-test-token"
    get delivery_connection_path(connection)
    assert_response :success
  end

  test "subscription creation snapshots selected destination rates" do
    service = services(:service)
    destination =
      Current.with(user: users(:other_user)) do
        DeliveryDestination.create!(
          user: users(:other_user),
          delivery_channel: @channel,
          name: "Inbox"
        )
      end
    post service_subscriptions_path(service),
         params: {
           subscription: {
             plan_id: plans(:plan).id,
             delivery_destination_ids: [destination.id]
           }
         }
    subscription = Subscription.order(:id).last
    assert_redirected_to subscription_billing_path(subscription)
    assert_equal users(:other_user), subscription.user
    assert_equal 1000, subscription.amount_cents
    assert_equal [destination.id],
                 subscription.subscription_destinations.pluck(
                   :delivery_destination_id
                 )
    get subscription_billing_path(subscription)
    assert_response :success
    assert_includes response.body, destination.to_s
  end

  test "editing destinations reviews the price before saving" do
    sign_in_admin
    service = services(:service)
    subscription, destination =
      Current.with(user: users(:other_user)) do
        [
          Subscription.create!(user: users(:other_user), plan: plans(:plan)),
          DeliveryDestination.create!(
            user: users(:other_user),
            delivery_channel: @channel,
            name: "Inbox"
          )
        ]
      end
    attributes = {
      subscription: {
        delivery_destination_ids: [destination.id]
      }
    }
    patch subscription_path(subscription), params: attributes, as: :json
    assert_response :success
    assert_equal "confirmation_required", response.parsed_body["status"]
    assert_equal 0, subscription.subscription_destinations.count
    confirmation = response.parsed_body.fetch("delivery_confirmation")
    patch subscription_path(subscription),
          params: attributes.merge(delivery_confirmation: confirmation),
          as: :json
    assert_response :success
    assert_equal [destination.id],
                 subscription.subscription_destinations.pluck(
                   :delivery_destination_id
                 )
  end

  test "signup links retain their plan" do
    get new_service_subscription_path(services(:service)),
        params: {
          plan_id: plans(:plan).id
        }
    assert_response :success
    assert_select "input[name='subscription[plan_id]'][value=?]",
                  plans(:plan).id.to_s
  end

  test "non admin cannot create destinations inline" do
    assert_no_difference %w[Subscription.count DeliveryDestination.count] do
      post service_subscriptions_path(services(:service)),
           params: {
             subscription: {
               plan_id: plans(:plan).id,
               new_delivery_destinations_attributes: {
                 "0" => {
                   delivery_channel_id: @channel.id
                 }
               }
             }
           },
           as: :json
    end
    assert_response :unprocessable_content
  end

  test "non admin cannot create delivery resources" do
    assert_no_difference "DeliveryDestination.count" do
      post delivery_destinations_path,
           params: {
             delivery_destination: {
               delivery_channel_id: @channel.id
             }
           },
           as: :json
    end
    assert_response :bad_request
    assert_no_difference "DeliveryConnection.count" do
      post delivery_connections_path,
           params: {
             delivery_connection: {
               name: "Slack",
               provider: "slack"
             }
           },
           as: :json
    end
    assert_response :bad_request
  end

  test "admin can provision destinations and personal connections for a subscriber" do
    sign_in_admin
    post delivery_connections_path,
         params: {
           delivery_connection: {
             user_id: users(:other_user).id,
             name: "Slack",
             provider: "slack"
           }
         },
         as: :json
    assert_response :success
    assert_equal users(:other_user), DeliveryConnection.order(:id).last.user

    post delivery_destinations_path,
         params: {
           delivery_destination: {
             user_id: users(:other_user).id,
             delivery_channel_id: @channel.id
           }
         },
         as: :json
    assert_response :success
    assert_equal users(:other_user), DeliveryDestination.order(:id).last.user
  end

  private

  def sign_in_admin
    delete login_path
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end
end
