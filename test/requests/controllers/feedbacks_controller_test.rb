# frozen_string_literal: true

require "test_helper"

class FeedbacksControllerTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper
  include ControllerSmokeHelper

  setup do
    @admin = users(:admin)
    @guest = guests(:guest)
    @other_user = users(:other_user)
    @previous_queue_adapter = ActiveJob::Base.queue_adapter
    ActiveJob::Base.queue_adapter = :test
    clear_enqueued_jobs
    clear_performed_jobs
  end

  teardown { ActiveJob::Base.queue_adapter = @previous_queue_adapter }

  test "new is available for guests" do
    get(new_feedback_path)

    assert_response(:ok)
  end

  test "guest can create feedback and receives email with message" do
    assert_difference("Feedback.count", 1) do
      assert_enqueued_jobs(1, only: ActionMailer::MailDeliveryJob) do
        post(
          feedbacks_path,
          params: {
            feedback: {
              message: "guest feedback message"
            }
          }
        )
      end
    end

    assert_redirected_to(new_feedback_path)

    perform_enqueued_jobs(only: ActionMailer::MailDeliveryJob)

    assert_match(
      "guest feedback message",
      ActionMailer::Base.deliveries.last.body.encoded
    )
  end

  test "email skips blank metadata lines" do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )

    assert_enqueued_jobs(1, only: ActionMailer::MailDeliveryJob) do
      post(
        feedbacks_path,
        params: {
          feedback: {
            message: "only message",
            user_id: nil,
            guest_id: nil,
            locale: "",
            path: "",
            ip: "",
            user_agent: ""
          }
        }
      )
    end

    perform_enqueued_jobs(only: ActionMailer::MailDeliveryJob)

    body = ActionMailer::Base.deliveries.last.body.encoded

    assert_match("only message", body)
    assert_no_match(/^locale:/, body)
    assert_no_match(/^user:/, body)
    assert_no_match(/^path:/, body)
    assert_no_match(/^ip:/, body)
    assert_no_match(/^user agent:/, body)
  end

  test "admin feedback routes smoke" do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )

    smoke_request("feedbacks", "index")
    smoke_request("feedbacks", "show")
    smoke_request("feedbacks", "new")
    smoke_request("feedbacks", "create")
    smoke_request("feedbacks", "edit")
    smoke_request("feedbacks", "update")
    smoke_request("feedbacks", "destroy")
    smoke_request("feedbacks", "delete")
  end
end
