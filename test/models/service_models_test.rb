# frozen_string_literal: true

require "test_helper"

class ServiceModelsTest < ActiveSupport::TestCase
  test "services, steps, and plans use the current locale for translated content" do
    records = [services(:service), steps(:step), plans(:plan)]

    Current.with(user: users(:admin)) do
      records.each do |record|
        record.update!(
          name_en: "English name",
          name_fr: "Nom français",
          description_en: "English description",
          description_fr: "Description française",
          body_en: "English body",
          body_fr: "Corps français"
        )
      end
    end

    records.each do |record|
      I18n.with_locale(:en) do
        assert_equal("English name", record.name.to_plain_text)
        assert_equal("English description", record.description.to_plain_text)
        assert_equal("English body", record.body.to_plain_text)
      end
      I18n.with_locale(:fr) do
        assert_equal("Nom français", record.name.to_plain_text)
        assert_equal("Description française", record.description.to_plain_text)
        assert_equal("Corps français", record.body.to_plain_text)
      end
    end
  end

  test "a subscription is unique for a user and plan" do
    Current.with(user: users(:admin)) do
      duplicate = subscriptions(:subscription).dup
      assert_not(duplicate.valid?)
      assert_predicate(duplicate.errors[:plan_id], :present?)
    end
  end

  test "a subscription uses its service name as its string representation" do
    Current.with(user: users(:admin)) do
      services(:service).update!(name_en: "Named service")
    end

    assert_equal("Named service", subscriptions(:subscription).to_s)
  end

  test "a subscription derives its schedule times from its plan schedules" do
    subscription = subscriptions(:subscription)
    plan = subscription.plan
    first_starts_at = Time.utc(2026, 8, 7, 8)
    second_starts_at = Time.utc(2026, 8, 7, 12)

    Current.with(user: users(:admin)) do
      plan.plan_schedules.delete_all
      plan.plan_schedules.create!(
        starts_at: first_starts_at,
        interval: "1 day"
      )
      plan.plan_schedules.create!(
        starts_at: second_starts_at,
        interval: "2 hours"
      )
    end

    travel_to(Time.utc(2026, 8, 8, 11)) do
      assert_equal(Time.utc(2026, 8, 7, 8), subscription.starts_at)
      assert_equal(Time.utc(2026, 8, 8, 10), subscription.previous_at)
      assert_equal(Time.utc(2026, 8, 8, 12), subscription.next_at)
    end
  end

  test "an unscheduled subscription has no schedule times" do
    subscription = subscriptions(:subscription)
    subscription.plan.plan_schedules.delete_all

    assert_nil(subscription.starts_at)
    assert_nil(subscription.previous_at)
    assert_nil(subscription.next_at)
  end

  test "a step execution must use a step from its service" do
    Current.with(user: users(:admin)) do
      other_service = Service.create!(user: users(:other_user))
      other_step = Step.create!(service: other_service, position: 0)
      execution = step_executions(:step_execution)
      execution.step = other_step

      assert_not(execution.valid?)
      assert_predicate(execution.errors[:step], :present?)
    end
  end
end
