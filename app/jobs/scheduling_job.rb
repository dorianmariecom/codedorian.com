# frozen_string_literal: true

class SchedulingJob < ContextJob
  queue_as(:scheduling)

  limits_concurrency(key: "SchedulingJob", on_conflict: :discard)

  def perform_with_context
    Program
      .includes(:program_schedules, :program_execution, user: :time_zones)
      .find_each do |program|
        perform_later(
          SchedulingProgramJob,
          arguments: {
            program: program
          },
          context: {
            user: program.user,
            program: program
          },
          current: {
            user: program.user,
            program: program,
            locale: program.user.locale,
            time_zone: program.user.unverified_time_zone
          }
        )
      end

    Subscription
      .includes(
        :plan_schedules,
        :subscription_execution,
        service: :steps,
        user: :time_zones
      )
      .find_each do |subscription|
        perform_later(
          SchedulingSubscriptionJob,
          arguments: {
            subscription: subscription
          },
          context: {
            user: subscription.user,
            subscription: subscription
          },
          current: {
            user: subscription.user,
            subscription: subscription,
            locale: subscription.user.locale,
            time_zone: subscription.user.unverified_time_zone
          }
        )
      end
  end
end
