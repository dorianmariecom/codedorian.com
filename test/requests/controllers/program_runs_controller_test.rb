# frozen_string_literal: true

require "test_helper"

class ProgramRunsControllerTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper

  setup do
    @previous_queue_adapter = ActiveJob::Base.queue_adapter
    ActiveJob::Base.queue_adapter = :test
    clear_enqueued_jobs
    clear_performed_jobs
  end

  teardown { ActiveJob::Base.queue_adapter = @previous_queue_adapter }

  test "guest can create a program run" do
    assert_difference("Program.count", 1) do
      assert_difference("User.count", 1) do
        assert_enqueued_jobs(1, only: ProgramEvaluateJob) do
          post(
            program_runs_path(format: :json),
            params: {
              input: "1 + 1",
              "g-recaptcha-action": "post/program_runs",
              "g-recaptcha-response": "token"
            },
            as: :json
          )
        end
      end
    end

    assert_response(:created)
    assert_equal("1 + 1", Program.last.input)
    assert_equal(I18n.t("program_runs.create.name"), Program.last.name)
    assert_predicate(Program.last.user, :simple?)
    json = response.parsed_body

    get(user_path(Program.last.user))
    assert_response(:ok)

    assert_equal("created", json.fetch("status"))
    assert_equal(false, json.fetch("finished"))
    assert(json.fetch("status_url").present?)
    assert_match(
      %r{/program_runs/#{Program.last.id}\.json\z},
      json.fetch("status_url")
    )

    assert_difference("ProgramExecution.count", 1) do
      perform_enqueued_jobs(only: ProgramEvaluateJob)
    end
    assert_predicate(Program.last.program_execution, :done?)

    get(json.fetch("status_url"))

    assert_response(:ok)

    json = response.parsed_body
    assert_equal("done", json.fetch("status"))
    assert_equal(true, json.fetch("finished"))
    assert_equal(
      Program.last.program_execution.result,
      json.fetch("result")
    )
  end

  test "show uses policy scope" do
    get(program_run_path(id: programs(:program), format: :json))

    assert_response(:bad_request)
    assert_equal("Pundit::NotAuthorizedError", response.parsed_body["message"])
  end
end
