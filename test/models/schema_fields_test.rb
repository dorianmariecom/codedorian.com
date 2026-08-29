# frozen_string_literal: true

require "test_helper"

class SchemaFieldsTest < ActiveSupport::TestCase
  setup { @admin = users(:admin) }

  test "plan fields override service fields in the service slot" do
    plan = plans(:plan)

    assert_equal(["phone_number"], plan.fields.map(&:key))
    assert_equal(plan_fields(:phone), plan.field_for(:phone_number))
    assert_equal(
      "Mobile number",
      plan.field_for(:phone_number).name_en.to_plain_text
    )
  end

  test "plan fields and service fields share position ordering" do
    plan = plans(:plan)

    Current.with(user: @admin) do
      plan.service.service_fields.create!(
        key: "username",
        name_en: "Username",
        name_fr: "Nom d'utilisateur",
        kind: "text",
        position: 1
      )
      plan.plan_fields.create!(
        key: "mobile",
        name_en: "Phone number",
        name_fr: "Numéro de téléphone",
        kind: "phone_number",
        position: 0
      )
    end

    assert_equal(%w[mobile username phone_number], plan.fields.map(&:key))
  end

  test "schema fields validate keys kinds and bilingual names" do
    Current.with(user: @admin) do
      field =
        services(:service).service_fields.new(
          key: "Phone Number",
          name_en: "Phone",
          name_fr: "Téléphone",
          kind: "unknown",
          position: -1
        )

      assert_not(field.valid?)
      assert(field.errors[:key].present?)
      assert(field.errors[:kind].present?)
      assert(field.errors[:position].present?)
    end
  end

  test "subscription values normalize and convert by kind" do
    Current.with(user: @admin) do
      value = subscription_values(:phone)
      value.update!(value: "+33 6 12 34 56 78")

      assert_equal("+33612345678", value.value)
      assert_equal("+33612345678", value.typed_value)
    end
  end

  test "subscription values reject malformed typed input" do
    Current.with(user: @admin) do
      field =
        plans(:plan).plan_fields.create!(
          key: "accepted",
          name_en: "Accepted",
          name_fr: "Accepté",
          kind: "boolean",
          position: 20
        )
      value =
        subscriptions(:subscription).subscription_values.new(
          key: field.key,
          value: "sometimes"
        )

      assert_not(value.valid?)
      assert(value.errors[:value].present?)
    end
  end

  test "deleting a definition preserves the answer" do
    value = subscription_values(:phone)

    Current.with(user: @admin) { plan_fields(:phone).destroy! }

    assert(value.reload.persisted?)
    assert_equal(service_fields(:phone), value.field)

    Current.with(user: @admin) { service_fields(:phone).destroy! }

    assert(value.reload.stale?)
  end
end
