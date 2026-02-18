# frozen_string_literal: true

require "test_helper"

class ScheduleConcernTest < ActiveSupport::TestCase
  include ActiveSupport::Testing::TimeHelpers

  test "once schedules return zero duration and keep starts_at" do
    starts_at = Time.zone.local(2025, 2, 10, 9, 30, 15)
    schedule = ExampleSchedule.new(starts_at: starts_at, interval: "once")

    assert_predicate(schedule, :once?)
    assert_not_predicate(schedule, :count?)
    assert_equal(0, schedule.count)
    assert_equal("once", schedule.per)
    assert_equal(0, schedule.duration)
    assert_equal(
      I18n.t("example_schedules.model.once"),
      schedule.translated_interval
    )
    assert_equal(starts_at, schedule.next_at)
    assert_equal(starts_at, schedule.previous_at)
  end

  test "counted schedules roll forward relative to now" do
    travel_to(Time.zone.local(2025, 2, 10, 10, 0, 0)) do
      starts_at = Time.zone.local(2025, 2, 10, 8, 0, 0)
      schedule = ExampleSchedule.new(starts_at: starts_at, interval: "2 hours")

      assert_predicate(schedule, :count?)
      assert_equal(2, schedule.count)
      assert_equal("hours", schedule.per)
      assert_equal(2.hours, schedule.duration)
      assert_equal(
        I18n.t("example_schedules.model.hours", count: 2),
        schedule.translated_interval
      )
      assert_equal(Time.zone.local(2025, 2, 10, 10, 0, 0), schedule.next_at)
      assert_equal(Time.zone.local(2025, 2, 10, 10, 0, 0), schedule.previous_at)
    end
  end

  test "monthly schedules pick the correct weekday and align time" do
    travel_to(Time.zone.local(2025, 3, 15, 12, 0, 0)) do
      starts_at = Time.zone.local(2025, 3, 1, 9, 30, 0)
      schedule =
        ExampleSchedule.new(starts_at: starts_at, interval: "first monday")

      expected_previous = Time.zone.local(2025, 3, 3, 9, 30, 0)
      expected_next = Time.zone.local(2025, 4, 7, 9, 30, 0)

      assert_not_predicate(schedule, :count?)
      assert_equal("first", schedule.count)
      assert_equal("monday", schedule.per)
      assert_equal(1.month, schedule.duration)
      assert_equal(
        I18n.t("example_schedules.model.first_monday"),
        schedule.translated_interval
      )
      assert_equal(expected_previous, schedule.previous_at)
      assert_equal(expected_next, schedule.next_at)
    end
  end

  test "daily schedules stay aligned to local wall clock across DST" do
    Time.use_zone("Europe/Paris") do
      travel_to(Time.zone.local(2026, 2, 11, 12, 0, 0)) do
        starts_at = Time.zone.local(2025, 5, 16, 6, 0, 0)
        schedule = ExampleSchedule.new(starts_at: starts_at, interval: "1 day")

        assert_equal(
          Time.zone.local(2026, 2, 11, 6, 0, 0),
          schedule.previous_at
        )
        assert_equal(Time.zone.local(2026, 2, 12, 6, 0, 0), schedule.next_at)
      end
    end
  end
end
