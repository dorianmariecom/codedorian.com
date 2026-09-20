# frozen_string_literal: true

require "test_helper"

class SubscriptionHeartbeatJobTest < ActiveJob::TestCase
  setup do
    @previous_queue_adapter = ActiveJob::Base.queue_adapter
    ActiveJob::Base.queue_adapter = :test
    clear_enqueued_jobs
    @subscription = subscriptions(:subscription)
    @url = "https://heartbeats.dorianmarie.com/checks/example"
    Current.with(user: users(:admin)) do
      @subscription.update!(heartbeats_url: @url)
      @execution =
        @subscription.subscription_executions.create!(status: :in_progress)
    end
  end

  teardown { ActiveJob::Base.queue_adapter = @previous_queue_adapter }

  test "successful execution posts once even when finished repeatedly" do
    request = stub_request(:post, @url).with(body: "").to_return(status: 200)
    Current.with(user: users(:admin)) do
      perform_enqueued_jobs(only: SubscriptionHeartbeatJob) do
        @execution.finish!
        @execution.reload.finish!
      end
    end
    assert_requested(request, times: 1)
    assert_predicate(@execution.reload, :done?)
  end

  test "unfinished and errored executions do not enqueue a heartbeat" do
    Current.with(user: users(:admin)) do
      step = @subscription.service.steps.first
      step_execution =
        @execution.step_executions.create!(step: step, status: :in_progress)
      assert_no_enqueued_jobs(only: SubscriptionHeartbeatJob) do
        @execution.finish!
        step_execution.update!(status: :errored)
        @execution.finish!
      end
    end
    assert_predicate(@execution.reload, :errored?)
  end

  test "heartbeat waits until every step succeeds" do
    request = stub_request(:post, @url).to_return(status: 204)
    Current.with(user: users(:admin)) do
      step = @subscription.service.steps.first
      first =
        @execution.step_executions.create!(step: step, status: :in_progress)
      last =
        @execution.step_executions.create!(step: step, status: :in_progress)

      assert_no_enqueued_jobs(only: SubscriptionHeartbeatJob) do
        first.update!(status: :done)
        @execution.finish!
      end
      assert_predicate(@execution.reload, :in_progress?)

      perform_enqueued_jobs(only: SubscriptionHeartbeatJob) do
        last.update!(status: :done)
        @execution.finish!
      end
    end
    assert_requested(request, times: 1)
    assert_predicate(@execution.reload, :done?)
  end

  test "blank url does not enqueue a heartbeat" do
    Current.with(user: users(:admin)) do
      @subscription.update!(heartbeats_url: nil)
      assert_no_enqueued_jobs(only: SubscriptionHeartbeatJob) do
        @execution.finish!
      end
    end
  end

  test "rolled back success does not enqueue a heartbeat" do
    Current.with(user: users(:admin)) do
      assert_no_enqueued_jobs(only: SubscriptionHeartbeatJob) do
        SubscriptionExecution.transaction(requires_new: true) do
          @execution.done!
          raise ActiveRecord::Rollback
        end
      end
    end
    assert_predicate(@execution.reload, :in_progress?)
  end

  test "heartbeat failure leaves execution successful" do
    stub_request(:post, @url).to_return(status: 500)
    Current.with(user: users(:admin)) { @execution.done! }
    assert_raises(Net::HTTPFatalError) do
      SubscriptionHeartbeatJob.perform_now(url: @url)
    end
    assert_predicate(@execution.reload, :done?)
  end

  test "heartbeat timeout leaves execution successful" do
    stub_request(:post, @url).to_timeout
    Current.with(user: users(:admin)) { @execution.done! }
    assert_raises(Net::OpenTimeout) do
      SubscriptionHeartbeatJob.perform_now(url: @url)
    end
    assert_predicate(@execution.reload, :done?)
  end
end
