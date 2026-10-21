# frozen_string_literal: true

require "test_helper"

class CodeRuntimeHelpersTest < ActiveSupport::TestCase
  setup do
    Current.user = users(:admin)
    Current.subscription = subscriptions(:subscription)
  end

  teardown { Current.reset }

  test "subscription state is scoped and supports atomic transformations" do
    assert_equal 1,
                 Code.evaluate(
                   "Current.subscription.state.update!((state) => { state.set(:count, (state[:count] or 0) + 1) }).count"
                 ).as_json
    assert_equal 2,
                 Code.evaluate(
                   "Current.subscription.state.update!((state) => { state.set(:count, state.count + 1) }).count"
                 ).as_json
    assert_equal 2, Code.evaluate("Current.subscription.state.count").as_json
    other = Subscription.create!(user: users(:admin), plan: plans(:plan))
    Current.subscription = other
    assert Code.evaluate("Current.subscription.state.get(:count)").nothing?
    assert_raises(Code::Error) do
      Code.evaluate("Current.subscription.state.update!((state) => { 1 })")
    end
  end

  test "unauthorized users cannot access another subscriptions state" do
    Code.evaluate('Current.subscription.state.set!(:secret, "private")')
    Current.user = users(:other_user)
    assert_raises(ActiveRecord::RecordNotFound) do
      Code.evaluate("Current.subscription.state")
    end
  end

  test "checkpoints persist independently of outputs and previous outputs require success" do
    execution = subscription_executions(:subscription_execution)
    previous = step_executions(:step_execution)
    step = Step.create!(service: previous.service, position: 1, input: "1")
    current =
      execution.step_executions.create!(
        step: step,
        input: "1",
        status: :initialized
      )
    Current.step_execution = previous
    Code.evaluate("Current.step_execution.checkpoint!(:page, 3)")
    assert_equal 3,
                 Code.evaluate(
                   "Current.step_execution.checkpoint(:page)"
                 ).as_json
    CodeState
      .new(previous, namespace: "result")
      .update { { "value" => { "answer" => 42 } } }
    Current.step_execution = current
    assert_equal 42,
                 Code.evaluate(
                   "Current.step_execution.previous_result.answer"
                 ).as_json
    assert Code.evaluate("Current.step_execution.checkpoint(:page)").nothing?
    previous.update!(status: :errored)
    assert_raises(Code::Error) do
      Code.evaluate("Current.step_execution.previous_result")
    end
  end

  test "evaluated steps retain structured results" do
    execution = step_executions(:step_execution)
    Current.step_execution = execution
    execution.update!(input: "{ answer: 42 }")
    execution.evaluate!
    assert_equal 42,
                 Code.evaluate(
                   "Current.step_execution.result_value.answer"
                 ).as_json
  end

  test "delivery result helpers follow the channel protocol" do
    assert_equal(
      {
        "status" => "rejected",
        "error_code" => "rate_limited",
        "retryable" => true
      },
      Code.evaluate("Delivery.rejected(:rate_limited, true)").as_json
    )
    assert_equal(
      { "status" => "uncertain" },
      Code.evaluate("Delivery.uncertain").as_json
    )
    assert_equal "123",
                 Code.evaluate('Delivery.accepted("123").provider_id').to_s
    assert_equal "hello", DeliveryContent.compact(text: "hello", limit: 10)
    shortened =
      DeliveryContent.compact(
        text: "a" * 100,
        limit: 40,
        url: "https://example.com"
      )
    assert_equal 40, shortened.size
    assert shortened.end_with?("https://example.com")
    assert_nil DeliveryContent.compact(text: "a" * 100, limit: 10)
  end

  test "state updates refresh existing handles and roll back on errors" do
    assert_equal 1, Code.evaluate(<<~CODE).as_json
      state = Current.subscription.state
      state.set!(:count, 1)
      state.count
    CODE
    assert_raises(Code::Error) do
      Code.evaluate(
        'Current.subscription.state.update!((state) => { fail("stop") })'
      )
    end
    assert_equal 1, Code.evaluate("Current.subscription.state.count").as_json
  end

  test "failed reevaluation does not expose stale structured results" do
    execution = step_executions(:step_execution)
    Current.step_execution = execution
    execution.update!(input: "{ answer: 42 }")
    execution.evaluate!
    execution.update!(input: 'fail("broken")')
    execution.evaluate!
    assert_predicate execution.reload, :errored?
    assert Code.evaluate("Current.step_execution.result_value").nothing?
  end
end
