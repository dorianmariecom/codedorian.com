# frozen_string_literal: true

require "test_helper"

class PlanScheduleTimeZonesTest < ActionDispatch::IntegrationTest
  test "subscription times use the viewer zone rather than the subscriber zone" do
    subscription = subscriptions(:subscription)
    Current.with(user: users(:admin)) do
      subscription.update!(user: users(:other_user))
      subscription.plan_schedules.first.update!(
        time_zone: "Europe/Paris",
        starts_at: "2026-10-15T09:00",
        interval: "once"
      )
    end
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    get(subscription_path(subscription))
    assert_response(:success)
    instant = Time.utc(2026, 10, 15, 7)
    tags =
      css_select("time").select do |tag|
        Time.iso8601(tag["datetime"]) == instant
      end
    assert_predicate(tags, :any?)
    tags.each do |tag|
      assert_equal(
        I18n.l(instant.in_time_zone("America/Los_Angeles"), format: :default),
        tag.text
      )
    end
    assert_select("time[data-local]", count: 0)
  end

  test "editing a schedule preserves its authoring time in another viewer zone" do
    schedule = plan_schedules(:plan_schedule)
    Current.with(user: users(:admin)) do
      schedule.update!(
        time_zone: "Europe/Paris",
        starts_at: "2026-10-15T09:00",
        interval: "once"
      )
    end
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
    get(edit_plan_schedule_path(schedule))
    assert_response(:success)
    assert_select(
      "input[name='plan_schedule[starts_at]'][value='2026-10-15T09:00:00']"
    )
    patch(
      plan_schedule_path(schedule),
      params: {
        plan_schedule: {
          starts_at: "2026-10-16T09:00",
          interval: "once"
        }
      }
    )
    assert_response(:redirect)
    assert_equal(Time.utc(2026, 10, 16, 7), schedule.reload.starts_at)
    assert_equal("Europe/Paris", schedule.time_zone)
  end
end
