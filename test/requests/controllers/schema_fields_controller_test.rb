# frozen_string_literal: true

require "test_helper"

class SchemaFieldsControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  test "admin manages service fields through standalone CRUD" do
    assert_difference("ServiceField.count", 1) do
      post(
        service_fields_path,
        params: {
          service_field: {
            service_id: services(:service).id,
            key: "nickname",
            name_en: "Nickname",
            name_fr: "Surnom",
            kind: "text",
            required: "0",
            position: 10
          }
        }
      )
    end

    field = ServiceField.order(:id).last
    assert_redirected_to(service_field_path(field))
    get(service_field_path(field))
    assert_response(:success)
    assert_select(".font-bold", text: "nickname")
  end

  test "admin manages plan fields through standalone CRUD" do
    assert_difference("PlanField.count", 1) do
      post(
        plan_fields_path,
        params: {
          plan_field: {
            plan_id: plans(:plan).id,
            key: "birthday",
            name_en: "Birthday",
            name_fr: "Date de naissance",
            kind: "date",
            required: "1",
            position: 10
          }
        }
      )
    end

    field = PlanField.order(:id).last
    assert_redirected_to(plan_field_path(field))
    get(plan_field_path(field))
    assert_response(:success)
    assert_select(".font-bold", text: "birthday")
  end

  test "service form creates nested fields" do
    assert_difference("ServiceField.count", 1) do
      patch(
        service_path(services(:service)),
        params: {
          service: {
            service_fields_attributes: {
              "0" => {
                key: "nickname",
                name_en: "Nickname",
                name_fr: "Surnom",
                kind: "text",
                required: "0",
                position: 20
              }
            }
          }
        }
      )
    end
  end
end
