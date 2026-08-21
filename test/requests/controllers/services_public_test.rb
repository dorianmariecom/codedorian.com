# frozen_string_literal: true

require "test_helper"

class ServicesPublicTest < ActionDispatch::IntegrationTest
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

  test "guest sees localized plans without administrative plan links" do
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
    assert_select("a[href=?]", plan_path(plan), count: 0)
    assert_select(
      "a.button[href=?]",
      new_service_subscription_path(service, locale: :fr),
      text: "s'abonner"
    )

    get(service_path(service, locale: :en))

    assert_response(:success)
    assert_select("div.font-bold", text: /English plan name/)
    assert_select("div.italic", text: /English plan description/)
    assert_select("body", text: /English plan body/)
    assert_select("body", text: /français de l’offre/, count: 0)
    assert_select("a[href=?]", plan_path(plan), count: 0)
    assert_select(
      "a.button[href=?]",
      new_service_subscription_path(service, locale: :en),
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
end
