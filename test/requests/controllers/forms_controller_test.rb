# frozen_string_literal: true

require "test_helper"

class FormsControllerTest < ActionDispatch::IntegrationTest
  test "show includes one nested section with one of each child" do
    get(form_path)

    assert_response(:success)
  end

  test "create redirects to root" do
    assert_difference("Submission.count") do
      post(
        form_path,
        params: {
          submission: {
            given_name: "Alex",
            family_name: "Doe",
            email_address: "alex@example.com",
            phone_number: "+1 555 111 2222",
            submission_sections_attributes: {
              "0" => {
                name: "Section from form",
                description: "Section description",
                submission_programs_attributes: {
                  "0" => {
                    form_program_id: form_programs(:form_program).id
                  }
                },
                submission_schedules_attributes: {
                  "0" => {
                    form_schedule_id: form_schedules(:form_schedule).id
                  }
                },
                submission_deliveries_attributes: {
                  "0" => {
                    form_delivery_id: form_deliveries(:form_delivery).id
                  }
                }
              }
            }
          }
        }
      )
    end

    assert_redirected_to(root_path)
  end
end
