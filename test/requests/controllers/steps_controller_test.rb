# frozen_string_literal: true

require "test_helper"

class StepsControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  test "format returns the persisted formatted step in json" do
    step = steps(:step)
    Current.with(user: users(:admin)) { step.update!(input: "{a:1}") }
    post(format_step_path(step), as: :json)
    assert_response(:success)
    assert_equal("ok", response.parsed_body["status"])
    assert_equal(Code.format("{a:1}"), step.reload.input)
    assert_equal(step.input, response.parsed_body.dig("data", "input"))
  end

  test "format all returns json and persists formatted steps" do
    step = steps(:step)
    Current.with(user: users(:admin)) { step.update!(input: "{a:1}") }
    post(format_all_steps_path, as: :json)
    assert_response(:success)
    assert_nil(response.parsed_body["data"])
    assert_equal(Code.format("{a:1}"), step.reload.input)
  end

  test "format errors return json for single and bulk actions" do
    step = steps(:step)
    Current.with(user: users(:admin)) { step.update!(input: "[") }
    [format_step_path(step), format_all_steps_path].each do |path|
      post(path, as: :json)
      assert_response(:bad_request)
      assert_equal("bad_request", response.parsed_body["status"])
      assert_predicate(response.parsed_body["messages"], :present?)
      assert_equal("[", step.reload.input)
    end
  end

  test "format html still redirects" do
    post(format_step_path(steps(:step)))
    assert_response(:redirect)
    post(format_all_steps_path)
    assert_response(:redirect)
  end
end
