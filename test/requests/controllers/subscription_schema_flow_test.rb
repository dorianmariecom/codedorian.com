# frozen_string_literal: true

require "test_helper"

class SubscriptionSchemaFlowTest < ActionDispatch::IntegrationTest
  setup do
    @plan = plans(:plan)
    @service = @plan.service
  end

  test "visitor registers with nested identity records then subscribes" do
    destination = new_service_subscription_path(
      locale: :fr,
      service_id: @service.id,
      subscription: { plan_id: @plan.id }
    )

    counts = [User.count, EmailAddress.count, Password.count]
    post(
        users_path,
        headers: { "Accept-Language" => "fr" },
        params: {
          redirect_to: destination,
          user: {
            interface: "simple",
            locale: "fr",
            email_addresses_attributes: {
              "0" => {
                email_address: "schema@example.test",
                primary: "1"
              }
            },
            passwords_attributes: {
              "0" => { password: "StrongPassword42!", primary: "1" }
            }
          }
        }
      )
    assert_response(:redirect, response.body)
    assert_equal(counts.map { |count| count + 1 }, [User.count, EmailAddress.count, Password.count])

    user = User.order(:id).last
    assert_equal(:simple, user.interface)
    assert_equal("fr", user.locale)
    assert_redirected_to(destination)

    get(destination)
    assert_response(:success)
    assert_select("label", text: /Numéro de mobile|Mobile number/)

    assert_difference(%w[Subscription.count SubscriptionValue.count], 1) do
      post(
        service_subscriptions_path(service_id: @service.id),
        params: {
          subscription: {
            plan_id: @plan.id,
            status: "active",
            subscription_values_attributes: {
              "0" => {
                key: "phone_number",
                value: "+33 6 11 22 33 44"
              }
            }
          }
        }
      )
    end

    subscription = user.subscriptions.order(:id).last
    assert_redirected_to(subscription_path(subscription))
    assert_equal("+33611223344", subscription.values["phone_number"].value)

    get(subscription_path(subscription))
    assert_response(:success)
    assert_select("body", text: /\+33611223344/)

    patch(
      subscription_path(subscription),
      params: { subscription: { plan_id: @plan.id, status: "inactive" } }
    )
    assert_redirected_to(subscription_path(subscription))
    assert(subscription.reload.inactive?)
  end

  test "login preserves a safe redirect and ignores an unsafe redirect" do
    post(
      login_path,
      params: {
        redirect_to: services_path,
        session: {
          email_address: email_addresses(:other_email).email_address,
          password: "MorningCoffee9"
        }
      }
    )
    assert(response.location.end_with?("/services"))

    delete(login_path)
    post(
      login_path,
      params: {
        redirect_to: "//example.org/phishing",
        session: {
          email_address: email_addresses(:other_email).email_address,
          password: "MorningCoffee9"
        }
      }
    )
    assert_redirected_to(users(:other_user))
  end
end
