# frozen_string_literal: true

require "test_helper"

class SubscriptionSchemaFlowTest < ActionDispatch::IntegrationTest
  setup do
    @plan = plans(:plan)
    @service = @plan.service
  end

  test "user chooses a plan before loading the subscription form" do
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    get(new_subscription_path)

    assert_response(:success)
    assert_select(
      "form[method='get'][action=?][data-controller='search']",
      new_subscription_path
    )
    assert_select(
      "select#subscription_plan_id[name='plan_id']" \
        "[data-action='search#search'] option[value=?]",
      @plan.id.to_s,
      text: @plan.to_s
    )
    assert_select("form[method='get'] input[type='submit']", count: 0)
    assert_select("input#subscription_selected_plan_id", count: 0)
    assert_select("input[type='tel'][name$='[value_input]']", count: 0)

    get(new_subscription_path(plan_id: @plan.id))

    assert_response(:success)
    assert_select(
      "select#subscription_plan_id[name='plan_id'] option[selected][value=?]",
      @plan.id.to_s
    )
    assert_select(
      "input#subscription_selected_plan_id[name='subscription[plan_id]']" \
        "[value=?]",
      @plan.id.to_s
    )
    assert_select("input[type='tel'][name$='[value_input]']")
    assert_select(
      "input[type='submit'][value=?]",
      I18n.t("subscriptions.new.submit")
    )
  end

  test "service subscription form only offers plans for that service" do
    other_plan =
      Current.with(user: users(:admin)) do
        other_service = Service.create!
        Plan.create!(service: other_service, slug: "other-service-plan")
      end
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    get(new_service_subscription_path(@service))

    assert_response(:success)
    assert_select(
      "form[method='get'][action=?]",
      new_service_subscription_path(@service)
    )
    assert_select(
      "select#subscription_plan_id option[value=?]",
      @plan.id.to_s
    )
    assert_select(
      "select#subscription_plan_id option[value=?]",
      other_plan.id.to_s,
      count: 0
    )
  end

  test "visitor registers with nested identity records then subscribes" do
    destination =
      new_service_subscription_path(
        locale: :fr,
        service_id: @service.id,
        subscription: {
          plan_id: @plan.id
        }
      )

    Current.with(user: users(:admin)) do
      @plan.update!(
        pricing_input: <<~CODE
          phone_number = Current.subscription.values.phone_number
          { amount_cents: 1000, amount_currency: "eur" }
        CODE
      )
    end

    counts = [User.count, EmailAddress.count, Password.count]
    post(
      users_path,
      headers: {
        "Accept-Language" => "fr"
      },
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
            "0" => {
              password: "StrongPassword42!",
              primary: "1"
            }
          }
        }
      }
    )
    assert_response(:redirect, response.body)
    assert_equal(
      counts.map { |count| count + 1 },
      [User.count, EmailAddress.count, Password.count]
    )

    user = User.order(:id).last
    assert_equal(:simple, user.interface)
    assert_equal("fr", user.locale)
    assert_redirected_to(destination)

    get(destination)
    assert_response(:success)
    assert_select("label", text: /Numéro de mobile|Mobile number/)
    assert_select(
      "input[type='hidden'][name$='[value]'][data-phone-number-target='hidden']"
    )
    assert_select(
      "div.max-w-xs[data-controller='phone-number'] " \
        "input[type='tel'][name$='[value_input]']"
    )

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
    assert_redirected_to(subscription_billing_path(subscription))
    assert_predicate(subscription, :inactive?)
    assert_equal(1_000, subscription.amount_cents)
    assert_equal("eur", subscription.amount_currency)
    assert_equal("+33611223344", subscription.values["phone_number"].value)

    get(subscription_path(subscription))
    assert_response(:success)
    assert_select("body", text: /\+33611223344/)

    patch(
      subscription_path(subscription),
      params: {
        subscription: {
          subscription_values_attributes: {
            "0" => {
              id: subscription.values.fetch("phone_number").id,
              key: "phone_number",
              value: "+33611223345"
            }
          }
        }
      }
    )
    assert_redirected_to(subscription_path(subscription))
    assert(subscription.reload.inactive?)
    assert_equal(
      "+33611223345",
      subscription.values.fetch("phone_number").value
    )

    post(activate_subscription_path(subscription))
    assert_redirected_to(root_path)
    assert_predicate(subscription.reload, :inactive?)
  end

  test "required inherited values cannot be omitted before pricing" do
    Current.with(user: users(:admin)) do
      ServiceField.create!(
        service: @service,
        key: "x_username",
        kind: "text",
        name_en: "X username",
        name_fr: "Nom d'utilisateur X",
        position: 10,
        required: true
      )
      @plan.update!(
        pricing_input: <<~CODE.squish
          {
            amount_cents:
              Current.subscription.values.x_username.to_string.length * 100,
            amount_currency: "eur"
          }
        CODE
      )
    end

    post(
      login_path,
      params: {
        session: {
          email_address: email_addresses(:other_email).email_address,
          password: "MorningCoffee9"
        }
      }
    )

    assert_no_difference(%w[Subscription.count SubscriptionValue.count]) do
      post(
        service_subscriptions_path(service_id: @service.id),
        params: {
          subscription: {
            plan_id: @plan.id,
            subscription_values_attributes: {
              "0" => {
                key: "x_username",
                value: "",
                _destroy: "1"
              }
            }
          }
        }
      )
    end

    assert_response(:unprocessable_content)
    assert_select("body", text: /X username can't be blank/)
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

  test "user can subscribe to the same plan multiple times" do
    admin = users(:admin)
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    assert(admin.subscriptions.exists?(plan: @plan))

    assert_difference("admin.subscriptions.where(plan: @plan).count", 1) do
      post(
        service_subscriptions_path(@service),
        params: {
          subscription: {
            plan_id: @plan.id,
            status: "inactive",
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

    subscription = admin.subscriptions.order(:id).last
    assert_redirected_to(subscription_billing_path(subscription))
  end

  test "user can destroy their own subscription" do
    user = users(:other_user)
    subscription =
      Current.with(user: user) do
        Subscription.create!(user: user, plan: @plan, status: "inactive")
      end
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    assert_difference("Subscription.count", -1) do
      delete(subscription_destroy_path(subscription_id: subscription))
    end

    assert_redirected_to(subscriptions_path)
  end

  test "destroying a billed subscription cancels it in Stripe" do
    admin = users(:admin)
    subscription = subscriptions(:subscription)
    Current.with(user: admin) do
      subscription.update!(
        stripe_subscription_id: "sub_test",
        stripe_status: "active"
      )
    end
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    cancellation =
      stub_request(
        :delete,
        "https://api.stripe.com/v1/subscriptions/sub_test"
      ).to_return(
        status: 200,
        body: {
          id: "sub_test",
          object: "subscription",
          status: "canceled"
        }.to_json,
        headers: {
          "Content-Type" => "application/json"
        }
      )

    assert_difference("Subscription.count", -1) do
      delete(subscription_destroy_path(subscription_id: subscription))
    end

    assert_requested(cancellation)
  end
end
