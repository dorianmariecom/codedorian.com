# frozen_string_literal: true

require "test_helper"

class SubscriptionSchedulingTest < ActiveJob::TestCase
  include ActiveJob::TestHelper

  setup do
    @previous_queue_adapter = ActiveJob::Base.queue_adapter
    ActiveJob::Base.queue_adapter = :test
    clear_enqueued_jobs
    clear_performed_jobs
    @user = users(:admin)
    @subscription = subscriptions(:subscription)
  end

  teardown { ActiveJob::Base.queue_adapter = @previous_queue_adapter }

  test "recurring scheduling checks every subscription" do
    assert_enqueued_jobs(Subscription.count, only: SchedulingSubscriptionJob) do
      SchedulingJob.perform_now
    end
  end

  test "a due active subscription enqueues its due step immediately" do
    Current.with(user: @user) do
      @subscription.subscription_executions.destroy_all
      @subscription.activate!
    end

    travel_to(Time.utc(2026, 8, 8, 11)) do
      assert_enqueued_jobs(1, only: StepEvaluateJob) do
        SchedulingSubscriptionJob.perform_now(
          subscription: @subscription,
          current: current_context,
          context: {
            subscription: @subscription
          }
        )
      end
    end
  end

  test "the earliest step offset determines when evaluation becomes due" do
    scheduled_at = Time.utc(2026, 8, 9, 12)
    Current.with(user: @user) do
      @subscription.subscription_executions.destroy_all
      @subscription.plan.plan_schedules.destroy_all
      @subscription.plan.plan_schedules.create!(
        starts_at: scheduled_at,
        interval: "1 day"
      )
      @subscription.service.steps.first.update!(offset_seconds: -1.hour.to_i)
    end

    travel_to(Time.utc(2026, 8, 9, 11)) do
      assert_equal(scheduled_at, @subscription.scheduled_at)
      assert_equal(Time.utc(2026, 8, 9, 11), @subscription.evaluation_at)

      SchedulingSubscriptionJob.perform_now(
        subscription: @subscription,
        current: current_context,
        context: {
          subscription: @subscription
        }
      )

      step_job = enqueued_jobs.find { |job| job[:job] == StepEvaluateJob }
      assert_nil(step_job[:at])
    end
  end

  test "inactive subscriptions do not enqueue steps" do
    Current.with(user: @user) { @subscription.deactivate! }

    assert_no_enqueued_jobs(only: StepEvaluateJob) do
      SchedulingSubscriptionJob.perform_now(
        subscription: @subscription,
        current: current_context,
        context: {
          subscription: @subscription
        }
      )
    end
  end

  test "future steps are checked again instead of being scheduled" do
    scheduled_at = Time.utc(2026, 8, 9, 12)
    Current.with(user: @user) do
      @subscription.subscription_executions.destroy_all
      @subscription.plan.plan_schedules.destroy_all
      @subscription.plan.plan_schedules.create!(
        starts_at: scheduled_at,
        interval: "1 day"
      )
      @subscription.service.steps.first.update!(offset_seconds: 1.hour.to_i)
    end

    travel_to(Time.utc(2026, 8, 9, 12, 30)) do
      assert_no_enqueued_jobs(only: StepEvaluateJob) do
        SchedulingSubscriptionJob.perform_now(
          subscription: @subscription,
          current: current_context,
          context: {
            subscription: @subscription
          }
        )
      end
    end

    travel_to(Time.utc(2026, 8, 9, 13)) do
      assert_enqueued_jobs(1, only: StepEvaluateJob) do
        SchedulingSubscriptionJob.perform_now(
          subscription: @subscription,
          current: current_context,
          context: {
            subscription: @subscription
          }
        )
      end
      assert_nil(enqueued_jobs.last[:at])
    end
  end

  test "scheduled steps run in order at their offsets and stop after an error" do
    scheduled_at = Time.utc(2026, 8, 9, 12)
    Current.with(user: @user) do
      @subscription.subscription_executions.destroy_all
      @subscription.plan.plan_schedules.destroy_all
      @subscription.plan.plan_schedules.create!(
        starts_at: scheduled_at,
        interval: "1 day"
      )
      @subscription.service.steps.first.update!(
        input: "1 + 1",
        offset_seconds: 0
      )
      @subscription.service.steps.create!(
        position: 1,
        input: "(",
        offset_seconds: 1.hour.to_i
      )
      @subscription.service.steps.create!(
        position: 2,
        input: "1 + 2",
        offset_seconds: 2.hours.to_i
      )
    end

    travel_to(scheduled_at) do
      assert_enqueued_jobs(1, only: StepEvaluateJob) { schedule_subscription }
    end

    execution = @subscription.subscription_executions.order(:id).last
    first, second, third =
      execution.step_executions.joins(:step).order("steps.position")

    StepEvaluateJob.perform_now(
      step_execution: first,
      current: current_context,
      context: {
        subscription: @subscription
      }
    )
    clear_enqueued_jobs

    travel_to(scheduled_at + 59.minutes) do
      assert_no_enqueued_jobs(only: StepEvaluateJob) { schedule_subscription }
    end

    travel_to(scheduled_at + 1.hour) do
      assert_enqueued_jobs(1, only: StepEvaluateJob) { schedule_subscription }
    end

    StepEvaluateJob.perform_now(
      step_execution: second,
      current: current_context,
      context: {
        subscription: @subscription
      }
    )
    clear_enqueued_jobs

    travel_to(scheduled_at + 2.hours) do
      assert_no_enqueued_jobs(only: StepEvaluateJob) { schedule_subscription }
    end

    assert_equal("errored", execution.reload.status)
    assert_equal("initialized", third.reload.status)
  end

  test "subscription evaluation stops after the first errored service step" do
    other_step = nil
    Current.with(user: @user) do
      @subscription.service.steps.first.update!(input: "1 + 1")
      @subscription.service.steps.create!(
        position: 1,
        input: "(",
        offset_seconds: 1.hour.to_i
      )
      @subscription.service.steps.create!(
        position: 2,
        input: "1 + 2",
        offset_seconds: 2.hours.to_i
      )
      other_service = Service.create!(user: @user)
      other_step =
        Step.create!(
          service: other_service,
          position: 0,
          input: 'output("wrong")'
        )
    end

    execution = Current.with(user: @user) { @subscription.create_execution! }

    assert_enqueued_jobs(0, only: StepEvaluateJob) do
      SubscriptionEvaluateJob.perform_now(
        subscription: @subscription,
        subscription_execution: execution,
        current: current_context.merge(subscription_execution: execution),
        context: {
          subscription: @subscription
        }
      )
    end

    assert_equal(
      @subscription.service.step_ids.sort,
      execution.step_executions.pluck(:step_id).sort
    )
    assert_not_includes(
      execution.step_executions.pluck(:step_id),
      other_step.id
    )

    assert_equal("errored", execution.reload.status)
    assert_equal(
      %w[done errored initialized],
      execution
        .step_executions
        .joins(:step)
        .order("steps.position")
        .pluck(:status)
    )
    assert_equal(
      ["2"],
      execution
        .step_executions
        .joins(:step)
        .where(status: :done)
        .order("steps.position")
        .pluck(:result)
    )
  end

  private

  def current_context
    {
      user: @user,
      subscription: @subscription,
      locale: I18n.locale,
      time_zone: @user.unverified_time_zone
    }
  end

  def schedule_subscription
    SchedulingSubscriptionJob.perform_now(
      subscription: @subscription,
      current: current_context,
      context: {
        subscription: @subscription
      }
    )
  end
end
