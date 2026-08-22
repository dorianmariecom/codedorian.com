# frozen_string_literal: true

require "test_helper"

class ApplicationHelperTest < ActionView::TestCase
  test "describes every supported schedule interval in both locales" do
    ScheduleConcern::INTERVALS
      .product(%i[en fr])
      .each do |interval, locale|
        I18n.with_locale(locale) do
          schedule =
            PlanSchedule.new(
              interval: interval,
              starts_at: Time.utc(2026, 8, 4, 10)
            )

          assert_predicate(
            plan_schedule_description(schedule),
            :present?,
            interval
          )
        end
      end
  end

  test "describes calendar intervals using the viewer time zone" do
    Time.use_zone("America/Los_Angeles") do
      assert_equal("every tuesday at 3:00am", description_for("1 week"))
      assert_equal(
        "every 2 weeks on tuesday at 3:00am",
        description_for("2 weeks")
      )
      assert_equal(
        "every first monday of the month at 3:00am",
        description_for("first monday")
      )
      assert_equal(
        "every month on the 4th at 3:00am",
        description_for("1 month")
      )
      assert_equal(
        "every 2 months on the 4th at 3:00am",
        description_for("2 months")
      )
      assert_equal(
        "every year on august 4th at 3:00am",
        description_for("1 year")
      )
      assert_equal(
        "every 2 years on august 4th at 3:00am",
        description_for("2 years")
      )
    end
  end

  private

  def description_for(interval)
    I18n.with_locale(:en) do
      plan_schedule_description(
        PlanSchedule.new(
          interval: interval,
          starts_at: Time.utc(2026, 8, 4, 10)
        )
      )
    end
  end
end
