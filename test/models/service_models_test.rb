# frozen_string_literal: true

require "test_helper"

class ServiceModelsTest < ActiveSupport::TestCase
  test "code objects expose every model attribute" do
    records = [
      users(:admin),
      addresses(:address),
      devices(:device),
      email_addresses(:admin_email),
      handles(:handle),
      names(:name),
      passwords(:password),
      phone_numbers(:phone_number),
      time_zones(:time_zone),
      tokens(:token),
      programs(:program),
      program_executions(:program_execution),
      program_schedules(:program_schedule),
      services(:service),
      steps(:step),
      plans(:plan),
      plan_schedules(:plan_schedule),
      subscriptions(:subscription),
      subscription_executions(:subscription_execution),
      step_executions(:step_execution)
    ]

    records.each do |record|
      assert_empty(
        record.attribute_names - record.to_code.raw.keys.map(&:to_s),
        record.class.name
      )
    end
  end

  test "code exposes every user association on demand" do
    user = users(:admin)
    user.association(:email_addresses).reset
    user.association(:phone_numbers).reset

    user.to_code

    assert_not(user.association(:email_addresses).loaded?)
    assert_not(user.association(:phone_numbers).loaded?)

    Current.with(user: user) do
      assertions = {
        "Current.user.addresses.first.id" => addresses(:address).id,
        "Current.user.devices.first.id" => devices(:device).id,
        "Current.user.email_addresses.first.id" =>
          email_addresses(:admin_email).id,
        "Current.user.handles.first.id" => handles(:handle).id,
        "Current.user.names.first.id" => names(:name).id,
        "Current.user.passwords.first.id" => passwords(:password).id,
        "Current.user.phone_numbers.first.id" =>
          phone_numbers(:phone_number).id,
        "Current.user.time_zones.first.id" => time_zones(:time_zone).id,
        "Current.user.tokens.first.id" => tokens(:token).id,
        "Current.user.program_executions.first.user.id" => user.id,
        "Current.user.sent_messages.size" => 0,
        "Current.user.received_messages.first.id" => messages(:message).id
      }

      assertions.each do |input, expected|
        assert_equal(expected, Code.evaluate(input).raw, input)
      end
    end
  end

  test "current derives the service graph while evaluating a subscription step" do
    subscription = subscriptions(:subscription)
    step_execution = step_executions(:step_execution)

    Current.with(
      user: subscription.user,
      subscription: subscription,
      step_execution: step_execution
    ) do
      assert_equal(subscription.service, Current.service)
      assert_equal(subscription.plan, Current.plan)
      assert_equal(step_execution.step, Current.step)
      assert_equal(Current.user, Current.subscription.user)
      assert_equal(Current.user, Current.service.user)
      assert_equal(Current.service, Current.step.service)
      assert_equal(Current.user, Current.step.user)
      assert_equal(Current.user, Current.step.service.user)
      assert_includes(Current.service.steps, Current.step)
      assert_includes(Current.service.plans, Current.plan)
      assert_includes(Current.plan.steps, Current.step)
    end
  end

  test "code can navigate the current subscription service graph" do
    subscription = subscriptions(:subscription)
    step_execution = step_executions(:step_execution)

    Current.with(
      user: subscription.user,
      subscription: subscription,
      step_execution: step_execution
    ) do
      assertions = {
        "Current.subscription.user.id" => subscription.user_id,
        "Current.service.user.id" => subscription.user_id,
        "Current.service.steps.first.id" => step_execution.step_id,
        "Current.service.plans.first.id" => subscription.plan_id,
        "Current.step.service.user.id" => subscription.user_id,
        "Current.step.user.id" => subscription.user_id,
        "Current.plan.steps.first.id" => step_execution.step_id
      }

      assertions.each do |input, expected|
        assert_equal(expected, Code.evaluate(input).raw, input)
      end
    end
  end

  test "code can navigate from the current program to its user" do
    program = programs(:program)

    Current.with(user: program.user, program: program) do
      assert_equal(
        program.user_id,
        Code.evaluate("Current.program.user.id").raw
      )
    end
  end

  test "code loads program schedules and executions only when requested" do
    program = programs(:program)
    program.association(:program_schedules).reset
    program.association(:program_executions).reset

    program.to_code

    assert_not(program.association(:program_schedules).loaded?)
    assert_not(program.association(:program_executions).loaded?)

    Current.with(user: program.user, program: program) do
      assert_equal(
        program_schedules(:program_schedule).id,
        Code.evaluate("Current.program.schedules.first.id").raw
      )
      assert_equal(
        program_executions(:program_execution).id,
        Code.evaluate("Current.program.executions.first.id").raw
      )
    end
  end

  test "code navigates current executions and schedules on demand" do
    program_execution = program_executions(:program_execution)
    program_schedule = program_schedules(:program_schedule)
    subscription_execution = subscription_executions(:subscription_execution)
    step_execution = step_executions(:step_execution)

    Current.with(
      user: users(:admin),
      program_execution: program_execution,
      program_schedule: program_schedule,
      step_execution: step_execution
    ) do
      assert_equal(program_execution.program_id, Current.program.id)
      assert_equal(subscription_execution, Current.subscription_execution)
      assert_equal(
        program_execution.program_id,
        Code.evaluate("Current.program_execution.program.id").raw
      )
      assert_equal(
        program_schedule.program_id,
        Code.evaluate("Current.program_schedule.program.id").raw
      )
      assert_equal(
        subscription_execution.subscription_id,
        Code.evaluate("Current.subscription_execution.subscription.id").raw
      )
      assert_equal(
        step_execution.step_id,
        Code.evaluate("Current.step_execution.step.id").raw
      )
      assert_equal(
        subscription_execution.id,
        Code.evaluate("Current.step_execution.subscription_execution.id").raw
      )
    end
  end

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
      plan.plan_schedules.create!(starts_at: first_starts_at, interval: "1 day")
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
