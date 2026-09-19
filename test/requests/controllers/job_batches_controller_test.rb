# frozen_string_literal: true

require "test_helper"

class JobBatchesControllerTest < ActionDispatch::IntegrationTest
  include ControllerSmokeHelper

  setup do
    @admin = users(:admin)
    @guest = guests(:guest)
    @other_user = users(:other_user)
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  smoke_actions_for "job_batches"
  test "admin can create update and delete a batch through json" do
    assert_difference("JobBatch.count", 1) do
      post job_batches_path(locale: I18n.locale),
           params: {
             job_batch: {
               description: "new batch",
               metadata: '{"source":"test"}'
             }
           },
           as: :json
      assert_response :success
    end
    batch = JobBatch.find(response.parsed_body.fetch("data").fetch("id"))
    assert_equal "test", batch.metadata.fetch("source")
    patch job_batch_path(batch, locale: I18n.locale),
          params: {
            job_batch: {
              description: "updated batch"
            }
          },
          as: :json
    assert_response :success
    assert_equal "updated batch", batch.reload.description
    delete job_batch_path(batch, locale: I18n.locale), as: :json
    assert_response :success
    assert_not JobBatch.exists?(batch.id)
  end

  test "invalid metadata returns a validation error" do
    post job_batches_path(locale: I18n.locale),
         params: {
           job_batch: {
             description: "invalid batch",
             metadata: "{"
           }
         },
         as: :json
    assert_response :unprocessable_content
  end

  test "non admins cannot read or create batches" do
    delete login_path
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    get job_batches_path(locale: I18n.locale), as: :json
    assert_response :bad_request
    assert_includes response.parsed_body.fetch("messages"),
                    "Pundit::NotAuthorizedError"
    assert_no_difference("JobBatch.count") do
      post job_batches_path(locale: I18n.locale),
           params: {
             job_batch: {
               description: "forbidden"
             }
           },
           as: :json
      assert_response :bad_request
      assert_includes response.parsed_body.fetch("messages"),
                      "Pundit::NotAuthorizedError"
    end
  end
  test "batch logs retain their context" do
    batch = job_batches(:job_batch)
    get logs_path(locale: I18n.locale, job_batch_id: batch.id), as: :json
    assert_response :success
  end
end
