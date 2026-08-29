# frozen_string_literal: true

require "test_helper"

class ServicesPublicTest < ActionDispatch::IntegrationTest
  test "guest sees a simple localized plan page with a subscribe button" do
    plan = plans(:plan)
    Current.with(user: users(:admin)) do
      plan.update!(
        name_en: "English plan name",
        name_fr: "Nom français de l’offre",
        description_en: "English plan description",
        description_fr: "Description française de l’offre",
        body_en: "English plan body",
        body_fr: "Corps français de l’offre"
      )
    end

    get(plan_path(plan, locale: :en))

    assert_response(:success)
    assert_select("div.p.font-bold", text: "English plan name")
    assert_select("body", text: /English plan description/)
    assert_select("body", text: /English plan body/)
    assert_select("body", text: /Nom français/, count: 0)
    assert_select("div.text-gray-600", count: 0)
    assert_select("a[href=?]", edit_plan_path(plan), count: 0)

    destination =
      new_service_subscription_path(
        plan.service,
        locale: :en,
        subscription: {
          plan_id: plan.id
        }
      )
    assert_select(
      "a.button[href=?]",
      new_user_path(locale: :en, redirect_to: destination),
      text: "subscribe"
    )
  end

  test "guest sees only unlabeled service content for the requested locale" do
    service = services(:service)
    Current.with(user: users(:admin)) do
      service.update!(
        name_en: "English service name",
        name_fr: "Nom français du service",
        description_en: "English service description",
        description_fr: "Description française du service",
        body_en: "English service body",
        body_fr: "Corps français du service"
      )
    end

    get(service_path(service, locale: :fr))

    assert_response(:success)
    assert_select("div.p.font-bold", text: /Nom français du service/)
    assert_select("div.p.italic", text: /Description française du service/)
    assert_select("body", text: /Corps français du service/)
    assert_select("body", text: /English service/, count: 0)
    assert_select("div.text-gray-600", count: 0)

    get(service_path(service, locale: :en))

    assert_response(:success)
    assert_select("div.p.font-bold", text: /English service name/)
    assert_select("div.p.italic", text: /English service description/)
    assert_select("body", text: /English service body/)
    assert_select("body", text: /français du service/, count: 0)
    assert_select("div.text-gray-600", count: 0)
  end

  test "guest sees localized plans with plan links and schedules" do
    service = services(:service)
    plan = plans(:plan)
    Current.with(user: users(:admin)) do
      plan.update!(
        name_en: "English plan name",
        name_fr: "Nom français de l’offre",
        description_en: "English plan description",
        description_fr: "Description française de l’offre",
        body_en: "English plan body",
        body_fr: "Corps français de l’offre"
      )
    end

    get(service_path(service, locale: :fr))

    assert_response(:success)
    assert_select("div.font-bold", text: /Nom français de l’offre/)
    assert_select("div.italic", text: /Description française de l’offre/)
    assert_select("body", text: /Corps français de l’offre/)
    assert_select("body", text: /English plan/, count: 0)
    assert_select("a[href=?]", plan_path(plan), text: /Nom français de l’offre/)
    assert_select("body", text: /tous les jours à \d{1,2} h \d{2}/)
    destination =
      new_service_subscription_path(
        service,
        locale: :fr,
        subscription: {
          plan_id: plan.id
        }
      )
    assert_select(
      "a.button[href=?]",
      new_user_path(locale: :fr, redirect_to: destination),
      text: "s'abonner"
    )

    get(service_path(service, locale: :en))

    assert_response(:success)
    assert_select("div.font-bold", text: /English plan name/)
    assert_select("div.italic", text: /English plan description/)
    assert_select("body", text: /English plan body/)
    assert_select("body", text: /français de l’offre/, count: 0)
    assert_select("a[href=?]", plan_path(plan), text: /English plan name/)
    assert_select("body", text: /every day at \d{1,2}:\d{2}(?:am|pm)/)
    destination =
      new_service_subscription_path(
        service,
        locale: :en,
        subscription: {
          plan_id: plan.id
        }
      )
    assert_select(
      "a.button[href=?]",
      new_user_path(locale: :en, redirect_to: destination),
      text: "subscribe"
    )
  end

  test "guest can browse services without admin controls" do
    service = services(:service)

    get(services_path)

    assert_response(:success)
    assert_select("a[href=?]", service_path(service))
    assert_select("a[href=?]", new_service_path, count: 0)
    assert_select("form[action=?]", destroy_all_services_path, count: 0)
    assert_select("form[action=?]", delete_all_services_path, count: 0)

    get(service_path(service))

    assert_response(:success)
    assert_select("a[href=?]", edit_service_path(service), count: 0)
    assert_select("form[action=?]", service_destroy_path(service), count: 0)
    assert_select("form[action=?]", service_delete_path(service), count: 0)
    %i[id user_id updated_at created_at].each do |attribute|
      assert_select(
        "div.text-gray-600",
        text: I18n.t("services.show.#{attribute}"),
        count: 0
      )
    end
    [
      steps_path,
      plans_path,
      subscriptions_path,
      subscription_executions_path,
      step_executions_path
    ].each do |association_path|
      assert_select("a[href=?]", association_path, count: 0)
    end
  end

  test "advanced non admin user sees all service and plan attributes without actions" do
    user = users(:other_user)
    user.update!(interface: :advanced)
    service = services(:service)
    plan = plans(:plan)
    subscription = nil
    subscription_execution = nil
    step_execution = nil
    Current.with(user: users(:admin)) do
      service.update!(
        name_en: "English service name",
        name_fr: "Nom français du service",
        description_en: "English service description",
        description_fr: "Description française du service",
        body_en: "English service body",
        body_fr: "Corps français du service"
      )
      plan.update!(
        name_en: "English plan name",
        name_fr: "Nom français de l’offre",
        description_en: "English plan description",
        description_fr: "Description française de l’offre",
        body_en: "English plan body",
        body_fr: "Corps français de l’offre"
      )
      subscription =
        Subscription.create!(user: user, plan: plan, status: :active)
      SubscriptionValue.create!(
        subscription: subscription,
        key: "phone_number",
        value: "+33600000000"
      )
      subscription_execution =
        SubscriptionExecution.create!(
          subscription: subscription,
          status: :initialized
        )
      step_execution =
        StepExecution.create!(
          subscription_execution: subscription_execution,
          step: steps(:step),
          status: :initialized
        )
    end
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )

    get(service_path(service))

    assert_response(:success)
    %i[
      id
      user_id
      name_en
      name_fr
      description_en
      description_fr
      body_en
      body_fr
      updated_at
      created_at
    ].each do |attribute|
      assert_select(
        "div.text-gray-600",
        text: I18n.t("services.show.#{attribute}")
      )
    end
    assert_select("a[href=?]", edit_service_path(service), count: 0)
    assert_select("form[action=?]", service_destroy_path(service), count: 0)
    assert_select("form[action=?]", service_delete_path(service), count: 0)
    assert_select("a[href=?]", plans_path(service_id: service.id))
    assert_select("a[href=?]", plan_path(plan))
    assert_select(
      "a[href=?]",
      new_plan_path(plan: { service_id: service.id }),
      count: 0
    )
    assert_select("a[href=?]", subscriptions_path(service_id: service.id))
    assert_select("a[href=?]", subscription_path(subscription))
    assert_select(
      "a[href=?]",
      subscription_path(subscriptions(:subscription)),
      count: 0
    )
    assert_select("a[href=?]", new_subscription_path)
    assert_select(
      "a[href=?]",
      subscription_executions_path(service_id: service.id)
    )
    assert_select(
      "a[href=?]",
      subscription_execution_path(subscription_execution)
    )
    assert_select(
      "a[href=?]",
      subscription_execution_path(
        subscription_executions(:subscription_execution)
      ),
      count: 0
    )
    assert_select("a[href=?]", new_subscription_execution_path, count: 0)
    assert_select("a[href=?]", steps_path(service_id: service.id))
    assert_select("a[href=?]", step_path(steps(:step)))
    assert_select("a[href=?]", new_step_path, count: 0)
    assert_select("a[href=?]", step_executions_path(service_id: service.id))
    assert_select("a[href=?]", step_execution_path(step_execution))
    assert_select(
      "a[href=?]",
      step_execution_path(step_executions(:step_execution)),
      count: 0
    )
    assert_select("a[href=?]", new_step_execution_path, count: 0)
    assert_select("a[href=?]", service_fields_path(service_id: service.id))
    assert_select("a[href=?]", service_field_path(service_fields(:phone)))
    assert_select("a[href=?]", new_service_field_path, count: 0)
    assert_select("a[href=?]", plan_fields_path(service_id: service.id))
    assert_select("a[href=?]", plan_field_path(plan_fields(:phone)))
    assert_select("a[href=?]", new_plan_field_path, count: 0)

    get(plan_path(plan))

    assert_response(:success)
    %i[
      id
      service_id
      name_en
      name_fr
      description_en
      description_fr
      body_en
      body_fr
      pricing_input
      updated_at
      created_at
    ].each do |attribute|
      assert_select(
        "div.text-gray-600",
        text: I18n.t("plans.show.#{attribute}")
      )
    end
    assert_select("a[href=?]", edit_plan_path(plan), count: 0)
    assert_select("form[action=?]", plan_destroy_path(plan), count: 0)
    assert_select("form[action=?]", plan_delete_path(plan), count: 0)
    assert_select("a[href=?]", plan_fields_path(plan_id: plan.id))
    assert_select("a[href=?]", plan_field_path(plan_fields(:phone)))
    assert_select("a[href=?]", new_plan_field_path, count: 0)
    assert_select("a[href=?]", subscriptions_path(plan_id: plan.id))
    assert_select("a[href=?]", subscription_path(subscription))
    assert_select("a[href=?]", new_subscription_path(plan_id: plan.id))
    assert_select("a[href=?]", subscription_executions_path(plan_id: plan.id))
    assert_select(
      "a[href=?]",
      subscription_execution_path(subscription_execution)
    )
    assert_select("a[href=?]", steps_path(service_id: plan.service_id))
    assert_select("a[href=?]", step_path(steps(:step)))
    assert_select("a[href=?]", step_executions_path(plan_id: plan.id))
    assert_select("a[href=?]", step_execution_path(step_execution))

    get(subscription_path(subscription))

    assert_response(:success)
    assert_select("a[href=?]", service_path(service))
    assert_select(
      ".p.font-bold",
      text: I18n.t("subscriptions.show.subscription_values")
    )
    assert_select("body", text: /\+33600000000/)
    assert_select(
      "a[href=?]",
      step_executions_path(subscription_id: subscription.id)
    )
    assert_select("a[href=?]", step_execution_path(step_execution))
    assert_select(
      "a[href=?]",
      step_execution_path(step_executions(:step_execution)),
      count: 0
    )

    get(step_executions_path)

    assert_response(:success)
    assert_select("a[href=?]", new_step_execution_path, count: 0)
  end
end
