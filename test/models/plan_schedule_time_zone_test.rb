# frozen_string_literal: true

require "test_helper"

class PlanScheduleTimeZoneTest < ActiveSupport::TestCase
  test "elapsed intervals retain their duration across daylight saving" do
    schedule =
      PlanSchedule.new(
        time_zone: "UTC",
        starts_at: "2026-03-08T00:00",
        interval: "2 hours"
      )
    travel_to(Time.utc(2026, 3, 8, 7, 30)) do
      assert_equal(
        Time.utc(2026, 3, 8, 7),
        schedule.previous_at(time_zone: "America/New_York")
      )
      assert_equal(
        Time.utc(2026, 3, 8, 9),
        schedule.next_at(time_zone: "America/New_York")
      )
    end
  end

  test "subscriber zone changes apply to future calculations and missing zones use the default" do
    subscription = subscriptions(:subscription)
    Current.with(user: users(:admin)) do
      subscription.plan_schedules.first.update!(
        time_zone: "Europe/Paris",
        starts_at: "2026-10-15T09:00",
        interval: "once"
      )
      subscription.user.time_zones.destroy_all
      assert_equal(Time.utc(2026, 10, 15, 9), subscription.starts_at)
      subscription.user.time_zones.create!(time_zone: "America/New_York")
      assert_equal(Time.utc(2026, 10, 15, 13), subscription.starts_at)
      subscription.user.time_zones.first.update!(time_zone: "Europe/Paris")
      assert_equal(Time.utc(2026, 10, 15, 7), subscription.starts_at)
    end
  end

  test "calendar schedules preserve the entered hour in each subscriber zone" do
    schedule =
      PlanSchedule.new(
        time_zone: "Europe/Paris",
        starts_at: "2026-03-01T09:00",
        interval: "1 day"
      )
    travel_to(Time.utc(2026, 3, 15, 12)) do
      Time.use_zone("Asia/Tokyo") do
        assert_equal(
          Time.utc(2026, 3, 16, 8),
          schedule.next_at(time_zone: "Europe/Paris")
        )
        assert_equal(
          Time.utc(2026, 3, 15, 13),
          schedule.next_at(time_zone: "America/New_York")
        )
        assert_equal(
          Time.utc(2026, 3, 14, 13),
          schedule.previous_at(time_zone: "America/New_York")
        )
      end
    end
    travel_to(Time.utc(2026, 11, 2, 12)) do
      assert_equal(
        Time.utc(2026, 11, 2, 14),
        schedule.next_at(time_zone: "America/New_York")
      )
    end
  end

  test "one off schedules preserve the calendar date and local hour" do
    schedule =
      PlanSchedule.new(
        time_zone: "Europe/Paris",
        starts_at: "2026-10-15T09:00",
        interval: "once"
      )
    assert_equal(
      Time.utc(2026, 10, 15, 13),
      schedule.next_at(time_zone: "America/New_York")
    )
    assert_equal(
      schedule.next_at(time_zone: "America/New_York"),
      schedule.previous_at(time_zone: "America/New_York")
    )
  end

  test "persisted schedule edits use their authoring zone" do
    schedule = plan_schedules(:plan_schedule)
    Current.with(user: users(:admin)) do
      schedule.update!(time_zone: "Europe/Paris", starts_at: "2026-10-15T09:00")
    end
    Time.use_zone("Asia/Tokyo") do
      schedule.reload
      assert_equal(9, schedule.local_starts_at.hour)
      schedule.starts_at = "2026-10-16T09:00"
      assert_equal(Time.utc(2026, 10, 16, 7), schedule.starts_at)
      assert_equal(
        Time.utc(2026, 10, 16, 13),
        schedule.starts_at_in(time_zone: "America/New_York")
      )
    end
  end

  test "weekly monthly and weekday schedules use the target calendar" do
    travel_to(Time.utc(2026, 3, 15, 12)) do
      {
        "1 week" => Time.utc(2026, 3, 15, 13),
        "1 month" => Time.utc(2026, 4, 1, 13),
        "first monday" => Time.utc(2026, 4, 6, 13)
      }.each do |interval, expected|
        schedule =
          PlanSchedule.new(
            time_zone: "Europe/Paris",
            starts_at: "2026-03-01T09:00",
            interval: interval
          )
        assert_equal(
          expected,
          schedule.next_at(time_zone: "America/New_York"),
          interval
        )
      end
    end
  end

  test "daylight saving gaps and folds follow Rails local time resolution" do
    zone = Time.find_zone!("America/New_York")
    %w[2026-03-08T02:30 2026-11-01T01:30].each do |value|
      schedule =
        PlanSchedule.new(time_zone: "UTC", starts_at: value, interval: "once")
      assert_equal(zone.parse(value), schedule.next_at(time_zone: zone))
    end
  end

  test "subscription calculations do not depend on the viewer zone" do
    subscription = subscriptions(:subscription)
    Current.with(user: users(:admin)) do
      subscription.user.time_zones.destroy_all
      subscription.user.time_zones.create!(
        time_zone: "America/New_York",
        primary: true
      )
      subscription.plan_schedules.first.update!(
        time_zone: "Europe/Paris",
        starts_at: "2026-03-01T09:00",
        interval: "1 day"
      )
    end
    travel_to(Time.utc(2026, 3, 15, 12)) do
      Time.use_zone("Asia/Tokyo") do
        assert_equal(Time.utc(2026, 3, 15, 13), subscription.next_at)
        assert_equal(Time.utc(2026, 3, 14, 13), subscription.previous_at)
        assert_equal(Time.utc(2026, 3, 1, 14), subscription.starts_at)
      end
    end
  end
end
