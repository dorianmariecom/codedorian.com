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

  test "subscriber connection pickers expose only owned names and ids" do
    owned, other =
      Current.with(user: users(:admin)) do
        [
          DeliveryConnection.create!(
            user: users(:other_user),
            provider: "slack",
            name: "Owned Slack",
            access_token: "owned-secret",
            enabled: true
          ),
          DeliveryConnection.create!(
            user: users(:admin),
            provider: "slack",
            name: "Other Slack",
            access_token: "other-secret",
            enabled: true
          )
        ]
      end
    channel =
      DeliveryChannel.create!(key: "slack", enabled: true, amount_cents: 0)
    [
      new_delivery_destination_path,
      new_service_subscription_path(
        services(:service),
        plan_id: plans(:plan).id
      )
    ].each do |path|
      get path
      assert_response :success
      assert_select "select[name*='[delivery_connection_id]'] option[value=?]",
                    owned.id.to_s,
                    text: owned.to_s
      assert_select "select[name*='[delivery_connection_id]'] option[value=?]",
                    other.id.to_s,
                    count: 0
      assert_not_includes response.body, "owned-secret"
      assert_not_includes response.body, "other-secret"
    end
    post service_subscriptions_path(services(:service)),
         params: {
           subscription: {
             plan_id: plans(:plan).id,
             delivery_destinations_attributes: [
               {
                 delivery_channel_id: channel.id,
                 delivery_connection_id: owned.id,
                 recipient: "#general"
               }
             ]
           }
         },
         as: :json
    assert_response :success
    assert_equal owned,
                 Subscription
                   .order(:id)
                   .last
                   .delivery_destinations
                   .sole
                   .delivery_connection
    post delivery_destinations_path,
         params: {
           delivery_destination: {
             delivery_channel_id: channel.id,
             delivery_connection_id: owned.id,
             recipient: "#general"
           }
         },
         as: :json
    assert_response :success
    assert_equal owned, DeliveryDestination.order(:id).last.delivery_connection
    assert_no_difference "DeliveryDestination.count" do
      post delivery_destinations_path,
           params: {
             delivery_destination: {
               delivery_channel_id: channel.id,
               delivery_connection_id: other.id,
               recipient: "#general"
             }
           },
           as: :json
      assert_response :unprocessable_content
    end
    get delivery_connection_path(owned), as: :json
    assert_response :success
    assert_equal "owned-secret",
                 response.parsed_body.fetch("data").fetch("access_token")
    get delivery_connections_path, as: :json
    assert_response :success
  end

  test "subscribers cannot access delivery audit pages" do
    destination =
      Current.with(user: users(:other_user)) do
        DeliveryDestination.create!(delivery_channel: @channel)
      end
    get logs_path,
        params: {
          delivery_destination_id: destination.id
        },
        as: :json
    assert_response :bad_request
    get versions_path,
        params: {
          delivery_destination_id: destination.id
        },
        as: :json
    assert_response :bad_request
  end

  test "delivery audit filters isolate each parent and persist in navigation" do
    sign_in_admin
    Current.user = users(:admin)
    destination = DeliveryDestination.create!(delivery_channel: @channel)
    connection =
      DeliveryConnection.create!(provider: "slack", name: "Audit Slack")
    selection =
      SubscriptionDestination.create!(
        subscription: subscriptions(:subscription),
        delivery_destination: destination
      )
    delivery =
      Delivery.create!(
        subscription: subscriptions(:subscription),
        delivery_destination: destination,
        event_key: "audit"
      )
    {
      delivery: delivery,
      delivery_channel: @channel,
      delivery_connection: connection,
      delivery_destination: destination,
      subscription_destination: selection
    }.each do |key, parent|
      matching_log =
        Log.create!(message: "Matching", context: { key => { id: parent.id } })
      unrelated_log =
        Log.create!(
          message: "Unrelated",
          context: {
            key => {
              id: parent.id + 1000
            }
          }
        )
      matching_version = Version.create!(item: parent, event: "update")
      unrelated_version =
        Version.create!(
          item_type: parent.class.name,
          item_id: parent.id + 1000,
          event: "update"
        )
      params = { "#{key}_id" => parent.id }
      get logs_path, params: params, as: :json
      assert_response :success
      ids = response.parsed_body.fetch("data").map { |row| row.fetch("id") }
      assert_includes ids, matching_log.id
      assert_not_includes ids, unrelated_log.id
      get versions_path, params: params, as: :json
      assert_response :success
      ids = response.parsed_body.fetch("data").map { |row| row.fetch("id") }
      assert_includes ids, matching_version.id
      assert_not_includes ids, unrelated_version.id
      get logs_path, params: params
      assert_response :success
      assert_select "a[href*='#{key}_id=#{parent.id}']"
      get versions_path, params: params
      assert_response :success
      assert_select "a[href*='#{key}_id=#{parent.id}']"
      get logs_path, params: { "#{key}_id" => parent.id + 1000 }, as: :json
      assert_response :bad_request
      get versions_path, params: { "#{key}_id" => parent.id + 1000 }, as: :json
      assert_response :bad_request
    end
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
    assert_select "form template input[name*='[delivery_destinations_attributes]'][name$='[name]']",
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
               delivery_destinations_attributes: {
                 "0" => {
                   delivery_channel_id: @channel.id
                 }
               }
             }
           },
           as: :json
      assert_response :success, response.body
    end
    assert_response :success
    subscription = Subscription.order(:id).last
    assert_equal users(:admin), subscription.delivery_destinations.sole.user
    assert_equal @channel.translated_key,
                 subscription.delivery_destinations.sole.to_s
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
               delivery_destinations_attributes: {
                 "0" => {
                   delivery_channel_id: @channel.id,
                   visibility: "invalid"
                 }
               }
             }
           }
    end
    assert_response :unprocessable_content
    assert_select "input[name*='[delivery_destinations_attributes]'][name$='[name]']",
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
        delivery_destinations_attributes: {
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
      assert_response :success, response.body
    end
    assert_response :success
    assert_equal @channel.translated_key,
                 subscription.reload.delivery_destinations.sole.to_s
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

  test "turbo subscription updates can confirm destinations added with a dynamic form index" do
    sign_in_admin
    subscription = subscriptions(:subscription)
    attributes = {
      user_id: subscription.user_id.to_s,
      plan_id: subscription.plan_id.to_s,
      status: subscription.status,
      subscription_values_attributes: {
        "0" =>
          subscription
            .subscription_values
            .sole
            .attributes
            .slice("id", "key", "value")
            .transform_values(&:to_s)
      },
      delivery_destinations_attributes: {
        "1789326877082" => {
          _destroy: "false",
          delivery_channel_id: @channel.id.to_s,
          recipient: "",
          delivery_connection_id: "",
          visibility: "private"
        }
      }
    }
    headers = { "Accept" => "text/vnd.turbo-stream.html, text/html" }
    assert_no_difference "DeliveryDestination.count" do
      patch subscription_path(subscription),
            params: {
              subscription: attributes
            },
            headers: headers
    end
    assert_response :unprocessable_content
    assert_equal "text/html", response.media_type
    form =
      css_select("form").find do |node|
        node["action"] == subscription_path(subscription)
      end
    assert form
    form.css("template").remove
    fields =
      form
        .css("input[name], select[name]")
        .filter_map do |field|
          next if field["type"].in?(%w[submit button]) || field["disabled"]

          value =
            if field.name == "select"
              field.at_css("option[selected]")&.[]("value")
            else
              field["value"]
            end
          [field["name"], value.to_s]
        end
    confirmation_params =
      Rack::Utils.parse_nested_query(URI.encode_www_form(fields))
    assert confirmation_params["delivery_confirmation"].present?
    changed_params = confirmation_params.deep_dup
    changed_params["subscription"][
      "delivery_destinations_attributes"
    ].values.first[
      "recipient"
    ] = "changed recipient"
    assert_no_difference "DeliveryDestination.count" do
      patch subscription_path(subscription), params: changed_params, as: :json
    end
    assert_equal "confirmation_required", response.parsed_body["status"]
    assert_difference "DeliveryDestination.count", 1 do
      patch subscription_path(subscription),
            params: confirmation_params,
            headers: headers
      assert_redirected_to subscription
    end
    assert_equal @channel.id,
                 subscription
                   .reload
                   .delivery_destinations
                   .sole
                   .delivery_channel_id
  end

  test "owner cannot view another users destination" do
    destination =
      Current.with(user: users(:admin)) do
        DeliveryDestination.create!(
          user: users(:admin),
          delivery_channel: @channel
        )
      end
    get delivery_destination_path(destination), as: :json
    assert_response :bad_request
  end

  test "owners can read delivery content but cannot retry deliveries" do
    delivery =
      Current.with(user: users(:admin)) do
        subscription =
          Subscription.create!(user: users(:other_user), plan: plans(:plan))
        destination =
          DeliveryDestination.create!(
            user: subscription.user,
            delivery_channel: @channel
          )
        Delivery.create!(
          subscription: subscription,
          delivery_destination: destination,
          event_key: "private-content",
          status: "failed",
          subject: "Private update",
          body_text: "Full delivery content"
        )
      end

    get delivery_path(delivery)
    assert_response :success
    assert_select "div", text: "Full delivery content"
    assert_select "form[action=?]", retry_delivery_path(delivery), count: 0
    get delivery_path(delivery), as: :json
    assert_response :success
    assert_equal "Full delivery content",
                 response.parsed_body.dig("data", "body_text")
    post retry_delivery_path(delivery), as: :json
    assert_response :bad_request
    assert_equal "failed", delivery.reload.status

    other_delivery =
      Current.with(user: users(:admin)) do
        destination =
          DeliveryDestination.create!(
            user: users(:admin),
            delivery_channel: @channel
          )
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
    destination =
      Current.with(user: users(:admin)) do
        DeliveryDestination.create!(
          user: users(:admin),
          delivery_channel: @channel
        )
      end
    @channel.update!(enabled: false)
    DeliveryChannel.create!(key: "push", enabled: true, amount_cents: 0)

    get edit_delivery_destination_path(destination)
    assert_response :success
    assert_select "select[name='delivery_destination[delivery_channel_id]'] option[selected][value=?]",
                  @channel.id.to_s
    patch delivery_destination_path(destination),
          params: {
            delivery_destination: {
              delivery_channel_id: @channel.id,
              enabled: false
            }
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
            delivery_channel: @channel
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

  test "admins can inspect normalized connection attributes" do
    sign_in_admin
    post delivery_connections_path,
         params: {
           delivery_connection: {
             name: "Slack",
             provider: "slack",
             access_token: "private-test-token"
           }
         },
         as: :json
    assert_response :success
    assert_includes response.body, "private-test-token"
    connection = DeliveryConnection.order(:id).last
    get edit_delivery_connection_path(connection)
    assert_response :success
    assert_includes response.body, "private-test-token"
    get delivery_connection_path(connection)
    assert_response :success
  end

  test "subscription creation snapshots selected destination rates" do
    service = services(:service)
    destination =
      Current.with(user: users(:other_user)) do
        DeliveryDestination.create!(
          user: users(:other_user),
          delivery_channel: @channel
        )
      end
    post service_subscriptions_path(service),
         params: {
           subscription: {
             plan_id: plans(:plan).id,
             delivery_destinations_attributes: [
               { delivery_channel_id: @channel.id }
             ]
           }
         }
    subscription = Subscription.order(:id).last
    assert_redirected_to subscription_billing_path(subscription)
    assert_equal users(:other_user), subscription.user
    assert_equal 1000, subscription.amount_cents
    assert_equal @channel.id,
                 subscription
                   .reload
                   .delivery_destinations
                   .sole
                   .delivery_channel_id
    get subscription_billing_path(subscription)
    assert_response :success
    assert_includes response.body, subscription.delivery_destinations.sole.to_s
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
            delivery_channel: @channel
          )
        ]
      end
    attributes = {
      subscription: {
        delivery_destinations_attributes: [{ delivery_channel_id: @channel.id }]
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
    assert_equal @channel.id,
                 subscription
                   .reload
                   .delivery_destinations
                   .sole
                   .delivery_channel_id
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

  test "non admin can create destinations inline" do
    assert_difference %w[Subscription.count DeliveryDestination.count], 1 do
      post service_subscriptions_path(services(:service)),
           params: {
             subscription: {
               plan_id: plans(:plan).id,
               delivery_destinations_attributes: {
                 "0" => {
                   delivery_channel_id: @channel.id
                 }
               }
             }
           },
           as: :json
      assert_response :success, response.body
    end
    assert_response :success
  end

  test "non admin can create destinations but cannot create connections" do
    assert_difference "DeliveryDestination.count", 1 do
      post delivery_destinations_path,
           params: {
             delivery_destination: {
               delivery_channel_id: @channel.id
             }
           },
           as: :json
      assert_response :success, response.body
    end
    assert_response :success
    assert_no_difference "DeliveryConnection.count" do
      post delivery_connections_path,
           params: {
             delivery_connection: {
               name: "Slack",
               provider: "slack"
             }
           },
           as: :json
      assert_response :bad_request
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

  test "nested destination removal requires confirmation and preserves the remaining selection" do
    sign_in_admin
    subscription = subscriptions(:subscription)
    first, second =
      Current.with(user: users(:admin)) do
        destinations =
          Array.new(2) do
            DeliveryDestination.create!(
              user: subscription.user,
              delivery_channel: @channel
            )
          end
        SubscriptionDeliveryBilling.select!(
          subscription,
          destinations.map(&:id)
        )
        destinations
      end
    attributes = {
      subscription: {
        delivery_destinations_attributes: [{ id: first.id, _destroy: "1" }]
      }
    }
    patch subscription_path(subscription), params: attributes, as: :json
    assert_response :success
    assert_equal "confirmation_required", response.parsed_body["status"]
    assert DeliveryDestination.exists?(first.id)
    confirmation = response.parsed_body.fetch("delivery_confirmation")
    patch subscription_path(subscription),
          params: attributes.merge(delivery_confirmation: confirmation),
          as: :json
    assert_response :success, response.body
    assert_equal [second.id], subscription.reload.delivery_destinations.ids
    assert_equal 1000, subscription.amount_cents
  end

  test "subscriber cannot assign a destination to another user" do
    post delivery_destinations_path,
         params: {
           delivery_destination: {
             user_id: users(:admin).id,
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
