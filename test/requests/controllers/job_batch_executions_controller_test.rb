# frozen_string_literal: true

require "test_helper"

class JobBatchExecutionsControllerTest < ActionDispatch::IntegrationTest
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

  smoke_actions_for "job_batch_executions"
  test "admin can create update and delete batch executions through json" do
    job_batch_executions(:job_batch_execution).delete
    batch = job_batches(:job_batch)
    job = jobs(:job)
    assert_difference("JobBatchExecution.count", 1) do
      post job_batch_executions_path(locale: I18n.locale),
           params: {
             job_batch_execution: {
               job_id: job.id,
               batch_id: batch.id
             }
           },
           as: :json
      assert_response :success
    end
    execution =
      JobBatchExecution.find(response.parsed_body.fetch("data").fetch("id"))
    patch job_batch_execution_path(execution, locale: I18n.locale),
          params: {
            job_batch_execution: {
              batch_id: batch.id
            }
          },
          as: :json
    assert_response :success
    delete job_batch_execution_path(execution, locale: I18n.locale), as: :json
    assert_response :success
    assert_not JobBatchExecution.exists?(execution.id)
  end
  test "non admins cannot read or create batch executions" do
    delete login_path
    sign_in(
      email_addresses(:other_email).email_address,
      passwords(:other_password).hint
    )
    get job_batch_executions_path(locale: I18n.locale), as: :json
    assert_response :bad_request
    assert_includes response.parsed_body.fetch("messages"),
                    "Pundit::NotAuthorizedError"
    assert_no_difference("JobBatchExecution.count") do
      post job_batch_executions_path(locale: I18n.locale),
           params: {
             job_batch_execution: {
               job_id: jobs(:job).id,
               batch_id: job_batches(:job_batch).id
             }
           },
           as: :json
      assert_response :bad_request
      assert_includes response.parsed_body.fetch("messages"),
                      "Pundit::NotAuthorizedError"
    end
  end

  test "batch execution logs retain their context" do
    execution = job_batch_executions(:job_batch_execution)
    get logs_path(locale: I18n.locale, job_batch_execution_id: execution.id),
        as: :json
    assert_response :success
  end
end
