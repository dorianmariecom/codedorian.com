# frozen_string_literal: true

require "test_helper"

class ServicesAdminCrudTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper

  setup do
    @previous_queue_adapter = ActiveJob::Base.queue_adapter
    ActiveJob::Base.queue_adapter = :test
    clear_enqueued_jobs
    clear_performed_jobs
    @admin = users(:admin)
    sign_in(
      email_addresses(:admin_email).email_address,
      passwords(:password).hint
    )
  end

  teardown { ActiveJob::Base.queue_adapter = @previous_queue_adapter }

  {
    services: :service,
    steps: :step,
    plans: :plan,
    plan_schedules: :plan_schedule,
    subscriptions: :subscription,
    subscription_executions: :subscription_execution,
    step_executions: :step_execution
  }.each do |controller, fixture|
    test "admin can browse #{controller}" do
      get(url_for(controller: controller, action: :index, only_path: true))
      assert_response(:success)

      record =
        case fixture
        when :service then services(:service)
        when :step then steps(:step)
        when :plan then plans(:plan)
        when :plan_schedule then plan_schedules(:plan_schedule)
        when :subscription then subscriptions(:subscription)
        when :subscription_execution
          subscription_executions(:subscription_execution)
        when :step_execution then step_executions(:step_execution)
        end
      get(
        url_for(
          controller: controller,
          action: :show,
          id: record,
          only_path: true
        )
      )
      assert_response(:success)

      get(url_for(controller: controller, action: :new, only_path: true))
      assert_response(:success)

      get(
        url_for(
          controller: controller,
          action: :edit,
          id: record,
          only_path: true
        )
      )
      assert_response(:success)
    end
  end

  test "creating a service defaults to the current user" do
    assert_difference("@admin.services.count", 1) do
      post(
        services_path,
        params: {
          service: {
            user_id: "",
            name_en: "Current user's service"
          }
        }
      )
    end

    assert_redirected_to(service_path(Service.order(:id).last))
  end

  test "creating a service accepts all translated content" do
    post(
      services_path,
      params: {
        service: {
          name_en: "English name",
          name_fr: "Nom français",
          description_en: "English description",
          description_fr: "Description française",
          body_en: "English body",
          body_fr: "Corps français"
        }
      }
    )

    service = Service.order(:id).last
    assert_redirected_to(service_path(service))
    assert_equal("English name", service.name_en.to_plain_text)
    assert_equal("Nom français", service.name_fr.to_plain_text)
    assert_equal("English description", service.description_en.to_plain_text)
    assert_equal("Description française", service.description_fr.to_plain_text)
    assert_equal("English body", service.body_en.to_plain_text)
    assert_equal("Corps français", service.body_fr.to_plain_text)
  end

  test "creating a subscription defaults to the current user" do
    plan =
      Current.with(user: @admin) { Plan.create!(service: services(:service)) }

    assert_difference("@admin.subscriptions.count", 1) do
      post(
        subscriptions_path,
        params: {
          subscription: {
            user_id: "",
            plan_id: plan.id,
            status: "active"
          }
        }
      )
    end

    assert_redirected_to(subscription_path(Subscription.order(:id).last))
  end

  test "creating a plan with a plan schedule" do
    assert_difference(%w[Plan.count PlanSchedule.count], 1) do
      post(
        plans_path,
        params: {
          plan: {
            service_id: services(:service).id,
            name_en: "Scheduled plan",
            plan_schedules_attributes: {
              "0" => {
                starts_at: 1.day.from_now,
                interval: "1 day"
              }
            }
          }
        }
      )
    end

    plan = Plan.order(:id).last
    assert_redirected_to(plan_path(plan))
    assert_equal(plan, PlanSchedule.order(:id).last.plan)
  end

  test "show pages link to new associated records" do
    service = services(:service)
    plan = plans(:plan)
    step = steps(:step)
    subscription = subscriptions(:subscription)
    subscription_execution = subscription_executions(:subscription_execution)

    get(service_path(service))
    assert_select(
      "a[href=?]",
      subscription_execution_path(
        subscription_executions(:subscription_execution)
      )
    )
    assert_select("a[href=?]", new_subscription_execution_path)
    assert_select(
      "a[href=?]",
      step_execution_path(step_executions(:step_execution))
    )
    assert_select("a[href=?]", new_step_execution_path)
    assert_select("a[href=?]", new_step_path(step: { service_id: service.id }))
    assert_select("a[href=?]", new_plan_path(plan: { service_id: service.id }))
    assert_select("a[href=?]", new_subscription_path)

    get(plan_path(plan))
    assert_select(
      "a[href=?]",
      new_plan_schedule_path(plan_schedule: { plan_id: plan.id })
    )
    assert_select(
      "a[href=?]",
      new_subscription_path(subscription: { plan_id: plan.id })
    )

    get(step_path(step))
    assert_select(
      "a[href=?]",
      new_step_execution_path(step_execution: { step_id: step.id })
    )

    get(subscription_path(subscription))
    assert_select(
      "a[href=?]",
      new_subscription_execution_path(
        subscription_execution: {
          subscription_id: subscription.id
        }
      )
    )

    get(subscription_execution_path(subscription_execution))
    assert_select(
      "a[href=?]",
      new_step_execution_path(
        step_execution: {
          subscription_execution_id: subscription_execution.id
        }
      )
    )
  end

  test "show pages display id before every other field" do
    {
      services: services(:service),
      steps: steps(:step),
      plans: plans(:plan),
      plan_schedules: plan_schedules(:plan_schedule),
      subscriptions: subscriptions(:subscription),
      subscription_executions: subscription_executions(:subscription_execution),
      step_executions: step_executions(:step_execution)
    }.each do |controller, record|
      get(
        url_for(
          controller: controller,
          action: :show,
          id: record,
          locale: I18n.locale,
          only_path: true
        )
      )

      first_label = response.parsed_body.at_css(".p > .text-gray-600")
      assert_equal(I18n.t("#{controller}.show.id"), first_label.text)
    end
  end

  test "new association forms preselect their parent" do
    plan = plans(:plan)

    get(new_plan_schedule_path(plan_schedule: { plan_id: plan.id }))

    assert_select(
      "select[name='plan_schedule[plan_id]'] option[selected][value=?]",
      plan.id.to_s
    )
  end

  test "subscription show displays its plan schedule times" do
    subscription = subscriptions(:subscription)

    get(subscription_path(subscription, locale: I18n.locale))

    assert_select(
      ".text-gray-600",
      text: I18n.t("subscriptions.show.starts_at")
    )
    assert_select(
      ".text-gray-600",
      text: I18n.t("subscriptions.show.previous_at")
    )
    assert_select(".text-gray-600", text: I18n.t("subscriptions.show.next_at"))
    assert_select("time", minimum: 3)
  end

  test "subscription evaluation button enqueues its evaluation job" do
    subscription = subscriptions(:subscription)

    get(subscription_path(subscription, locale: I18n.locale))
    assert_select(
      "form[action=?][method='post']",
      evaluate_subscription_path(subscription, locale: I18n.locale)
    )

    assert_enqueued_jobs(1, only: SubscriptionEvaluateJob) do
      post(evaluate_subscription_path(subscription, locale: I18n.locale))
    end

    assert_redirected_to(subscription_path(subscription))
  end

  test "subscription evaluation job evaluates its subscription execution" do
    subscription = subscriptions(:subscription)
    subscription_execution =
      Current.with(user: @admin) { subscription.create_execution! }

    assert_no_difference("subscription.subscription_executions.count") do
      SubscriptionEvaluateJob.perform_now(
        subscription: subscription,
        subscription_execution: subscription_execution,
        current: {
          user: @admin,
          subscription: subscription,
          subscription_execution: subscription_execution,
          locale: I18n.locale,
          time_zone: Time.zone.name
        },
        context: {
          subscription: subscription
        }
      )
    end

    assert_equal("errored", subscription.subscription_executions.last.status)
  end

  test "subscription can be deactivated and activated from its show page" do
    subscription = subscriptions(:subscription)

    get(subscription_path(subscription, locale: I18n.locale))
    assert_select(
      "form[action=?][method='post']",
      deactivate_subscription_path(subscription, locale: I18n.locale)
    )

    post(deactivate_subscription_path(subscription, locale: I18n.locale))
    assert_equal("inactive", subscription.reload.status)

    get(subscription_path(subscription, locale: I18n.locale))
    assert_select(
      "form[action=?][method='post']",
      activate_subscription_path(subscription, locale: I18n.locale)
    )

    post(activate_subscription_path(subscription, locale: I18n.locale))
    assert_equal("active", subscription.reload.status)
  end

  test "service domain forms use translated association labels" do
    {
      new_service_path(locale: I18n.locale) => {
        service_user_id: Service.human_attribute_name(:user_id)
      },
      new_step_path(locale: I18n.locale) => {
        step_service_id: Step.human_attribute_name(:service_id)
      },
      new_plan_path(locale: I18n.locale) => {
        plan_service_id: Plan.human_attribute_name(:service_id)
      },
      new_plan_schedule_path(locale: I18n.locale) => {
        plan_schedule_plan_id: PlanSchedule.human_attribute_name(:plan_id)
      },
      new_subscription_path(locale: I18n.locale) => {
        subscription_user_id: Subscription.human_attribute_name(:user_id),
        subscription_plan_id: Subscription.human_attribute_name(:plan_id)
      },
      new_subscription_execution_path(locale: I18n.locale) => {
        subscription_execution_subscription_id:
          SubscriptionExecution.human_attribute_name(:subscription_id)
      },
      new_step_execution_path(locale: I18n.locale) => {
        step_execution_subscription_execution_id:
          StepExecution.human_attribute_name(:subscription_execution_id),
        step_execution_step_id: StepExecution.human_attribute_name(:step_id)
      }
    }.each do |path, labels|
      get(path)

      labels.each do |field_id, text|
        assert_select("label[for='#{field_id}']", text: text)
      end
    end
  end

  test "step inputs use code editors and link to editing from show pages" do
    step = steps(:step)
    step_execution = step_executions(:step_execution)

    get(edit_step_path(step))
    assert_select(
      "[data-controller='editor'][data-editor-language-value='code']"
    ) do
      assert_select("input[type='hidden'][name='step[input]']")
      assert_select("[data-editor-target='editor']")
    end

    get(edit_step_execution_path(step_execution))
    assert_select(
      "[data-controller='editor'][data-editor-language-value='code']"
    ) do
      assert_select("input[type='hidden'][name='step_execution[input]']")
      assert_select("[data-editor-target='editor']")
    end

    get(step_path(step))
    assert_select("a[href=?] .code", edit_step_path(step), text: step.input)

    get(step_execution_path(step_execution))
    assert_select(
      "a[href=?] .code",
      edit_step_execution_path(step_execution),
      text: step_execution.input
    )
  end

  test "destroying all services destroys their dependent records" do
    assert_difference(
      %w[
        Service.count
        Plan.count
        Subscription.count
        SubscriptionExecution.count
        Step.count
        StepExecution.count
      ],
      -1
    ) { delete(destroy_all_services_path) }

    assert_redirected_to(services_path)
  end
end
